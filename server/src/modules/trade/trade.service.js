import { Prisma } from "@prisma/client";

import walletService from "../wallet/wallet.service.js";
import tradeRepository from "./trade.repository.js";

class TradeService {

    /**
     * Execute a matched trade.
     *
     * Responsibilities:
     * 1. Consume buyer's locked quote asset
     * 2. Credit buyer's base asset
     * 3. Consume seller's locked base asset
     * 4. Credit seller's quote asset
     * 5. Create trade record
     * 6. Update both orders
     *
     * This function MUST be called inside a Prisma transaction.
     */
    async executeTrade({
        tx,
        buyOrder,
        sellOrder,
        quantity,
        price
    }) {

        if (!tx) {
            throw new Error(
                "Transaction client is required"
            );
        }

        if (!buyOrder || !sellOrder) {
            throw new Error(
                "Buy order and sell order are required"
            );
        }

        if (!quantity || !price) {
            throw new Error(
                "Trade quantity and price are required"
            );
        }

        const tradeQuantity =
            new Prisma.Decimal(quantity);

        const tradePrice =
            new Prisma.Decimal(price);

        if (tradeQuantity.lessThanOrEqualTo(0)) {
            throw new Error(
                "Trade quantity must be greater than zero"
            );
        }

        if (tradePrice.lessThanOrEqualTo(0)) {
            throw new Error(
                "Trade price must be greater than zero"
            );
        }

        //-----------------------------------------
        // Calculate Trade Value
        //-----------------------------------------

        const tradeValue =
            tradeQuantity.mul(tradePrice);

        //-----------------------------------------
        // Wallet IDs
        //-----------------------------------------

        if (!buyOrder.user?.wallet?.id) {
            throw new Error(
                "Buyer wallet not found"
            );
        }

        if (!sellOrder.user?.wallet?.id) {
            throw new Error(
                "Seller wallet not found"
            );
        }

        const buyerWalletId =
            buyOrder.user.wallet.id;

        const sellerWalletId =
            sellOrder.user.wallet.id;

        //-----------------------------------------
        // Buyer Settlement
        //-----------------------------------------

        // Buyer spends quote asset
        // Example: USDT

        await walletService.consumeLockedBalance(
            tx,
            buyerWalletId,
            buyOrder.tradingPair.quoteAssetId,
            tradeValue
        );

        // Buyer receives base asset
        // Example: BTC

        await walletService.creditBalance(
            tx,
            buyerWalletId,
            buyOrder.tradingPair.baseAssetId,
            tradeQuantity
        );

        //-----------------------------------------
        // Seller Settlement
        //-----------------------------------------

        // Seller spends base asset
        // Example: BTC

        await walletService.consumeLockedBalance(
            tx,
            sellerWalletId,
            sellOrder.tradingPair.baseAssetId,
            tradeQuantity
        );

        // Seller receives quote asset
        // Example: USDT

        await walletService.creditBalance(
            tx,
            sellerWalletId,
            sellOrder.tradingPair.quoteAssetId,
            tradeValue
        );

        //-----------------------------------------
        // Create Trade Record
        //-----------------------------------------

        const trade =
            await tradeRepository.createTrade(
                tx,
                {
                    tradingPairId:
                        buyOrder.tradingPairId,

                    buyOrderId:
                        buyOrder.id,

                    sellOrderId:
                        sellOrder.id,

                    buyerId:
                        buyOrder.userId,

                    sellerId:
                        sellOrder.userId,

                    quantity:
                        tradeQuantity,

                    price:
                        tradePrice
                }
            );

        //-----------------------------------------
        // Update Buyer Order
        //-----------------------------------------

        await this.updateOrderAfterTrade(
            tx,
            buyOrder,
            tradeQuantity
        );

        //-----------------------------------------
        // Update Seller Order
        //-----------------------------------------

        await this.updateOrderAfterTrade(
            tx,
            sellOrder,
            tradeQuantity
        );

        //-----------------------------------------
        // Return Trade
        //-----------------------------------------

        return trade;
    }


    /**
     * Update order after a trade.
     *
     * Example:
     *
     * Before:
     * quantity          = 1 BTC
     * filledQuantity    = 0.4 BTC
     * remainingQuantity = 0.6 BTC
     *
     * Trade:
     * 0.6 BTC
     *
     * After:
     * filledQuantity    = 1 BTC
     * remainingQuantity = 0
     * status            = FILLED
     */
    async updateOrderAfterTrade(
        tx,
        order,
        tradeQuantity
    ) {

        const currentFilled =
            new Prisma.Decimal(
                order.filledQuantity
            );

        const currentRemaining =
            new Prisma.Decimal(
                order.remainingQuantity
            );

        const quantity =
            new Prisma.Decimal(
                tradeQuantity
            );

        //-----------------------------------------
        // Validate Trade Quantity
        //-----------------------------------------

        if (quantity.lessThanOrEqualTo(0)) {
            throw new Error(
                "Trade quantity must be greater than zero"
            );
        }

        if (quantity.greaterThan(currentRemaining)) {
            throw new Error(
                "Trade quantity exceeds remaining order quantity"
            );
        }

        //-----------------------------------------
        // Calculate New Values
        //-----------------------------------------

        const newFilledQuantity =
            currentFilled.plus(quantity);

        const newRemainingQuantity =
            currentRemaining.minus(quantity);

        //-----------------------------------------
        // Determine Status
        //-----------------------------------------

        let status = "PARTIALLY_FILLED";

        if (
            newRemainingQuantity.lessThanOrEqualTo(0)
        ) {
            status = "FILLED";
        }

        //-----------------------------------------
        // Update Order
        //-----------------------------------------

        return tx.order.update({

            where: {
                id: order.id
            },

            data: {

                filledQuantity:
                    newFilledQuantity,

                remainingQuantity:
                    newRemainingQuantity,

                status

            }

        });
    }

}

export default new TradeService();