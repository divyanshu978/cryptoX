import { Prisma } from "@prisma/client";

import walletService from "../wallet/wallet.service.js";
import tradeRepository from "./trade.repository.js";

class TradeService {

    async executeTrade({
        tx,
        buyOrder,
        sellOrder,
        quantity,
        price
    }) {

        const tradeQuantity = new Prisma.Decimal(quantity);
        const tradePrice = new Prisma.Decimal(price);

        const tradeValue = tradeQuantity.mul(tradePrice);

        //-----------------------------------------
        // Wallet IDs
        //-----------------------------------------

        const buyerWalletId = buyOrder.user.wallet.id;
        const sellerWalletId = sellOrder.user.wallet.id;

        //-----------------------------------------
        // Buyer Settlement
        //-----------------------------------------

        await walletService.consumeLockedBalance(
            tx,
            buyerWalletId,
            buyOrder.tradingPair.quoteAssetId,
            tradeValue
        );

        await walletService.creditBalance(
            tx,
            buyerWalletId,
            buyOrder.tradingPair.baseAssetId,
            tradeQuantity
        );

        //-----------------------------------------
        // Seller Settlement
        //-----------------------------------------

        await walletService.consumeLockedBalance(
            tx,
            sellerWalletId,
            sellOrder.tradingPair.baseAssetId,
            tradeQuantity
        );

        await walletService.creditBalance(
            tx,
            sellerWalletId,
            sellOrder.tradingPair.quoteAssetId,
            tradeValue
        );

        //-----------------------------------------
        // Create Trade
        //-----------------------------------------

        const trade = await tradeRepository.createTrade(tx, {

            tradingPairId: buyOrder.tradingPairId,

            buyOrderId: buyOrder.id,
            sellOrderId: sellOrder.id,

            buyerId: buyOrder.userId,
            sellerId: sellOrder.userId,

            quantity: tradeQuantity,
            price: tradePrice

        });

        //-----------------------------------------
        // Update Orders
        //-----------------------------------------

        await this.updateOrderAfterTrade(
            tx,
            buyOrder,
            tradeQuantity
        );

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

}

export default new TradeService();