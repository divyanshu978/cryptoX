import { Prisma } from "@prisma/client";
import prisma from "../../config/prisma.js";
import orderRepository from "./order.repository.js";
import walletService from "../wallet/wallet.service.js";
import { calculateLockAmount, lockAsset } from "./order.utils.js";
import walletService from "../wallet/wallet.service.js";

class OrderService {

    async placeOrder(userId, payload) {

        const {
            pair,
            side,
            type,
            price,
            quantity
        } = payload;

        if (!pair || !side || !type || !quantity) {
            throw new Error("Missing required fields");
        }

        if (Number(quantity) <= 0) {
            throw new Error("Invalid quantity");
        }

        if (type === "LIMIT" && Number(price) <= 0) {
            throw new Error("Invalid price");
        }

        const tradingPair =
            await orderRepository.findTradingPairBySymbol(pair);

        if (!tradingPair) {
            throw new Error("Trading pair not found");
        }

        const lockAmount = calculateLockAmount(
            side,
            price,
            quantity
        );

        const lockAsset = getLockAsset(
            side,
            tradingPair
        );

        const wallet =
            await walletRepository.findWalletByUserId(userId);

        if (!wallet) {
            throw new Error("Wallet not found");
        }

        await walletService.lockBalance(
            tx,
            wallet.id,
            lockAsset.id,
            lockAmount
        );

        const order = await orderRepository.createOrder(
            tx,
            {
                userId,

                tradingPairId: tradingPair.id,

                side,

                type,

                status: "OPEN",

                price: new Prisma.Decimal(price),

                quantity: new Prisma.Decimal(quantity),

                filledQuantity: new Prisma.Decimal(0),

                remainingQuantity: new Prisma.Decimal(quantity)
            }
        );

        return order;
    }

    async cancelOrder(userId, orderId) {

    }

    async getOrders(userId) {

    }

    async getOrder(orderId) {

    }

}

export default new OrderService();