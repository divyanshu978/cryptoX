import { Prisma } from "@prisma/client";
import prisma from "../../config/prisma.js";

import orderRepository from "./order.repository.js";
import walletRepository from "../wallet/wallet.repository.js";
import walletService from "../wallet/wallet.service.js";
import matchingService from "../matching/matching.service.js";

import {
    calculateLockAmount,
    getLockAsset
} from "./order.utils.js";

class OrderService {

    async placeOrder(userId, payload) {

        const {
            pair,
            side,
            type,
            price,
            quantity
        } = payload;

        //---------------------------------
        // Validation
        //---------------------------------

        if (!pair || !side || !type || !quantity) {
            throw new Error("Missing required fields");
        }

        if (Number(quantity) <= 0) {
            throw new Error("Invalid quantity");
        }

        if (type === "LIMIT") {

            if (!price || Number(price) <= 0) {
                throw new Error("Invalid price");
            }

        }

        //---------------------------------
        // Trading Pair
        //---------------------------------

        const tradingPair =
            await orderRepository.findTradingPairBySymbol(pair);

        if (!tradingPair) {
            throw new Error("Trading pair not found");
        }

        //---------------------------------
        // Wallet
        //---------------------------------

        const wallet =
            await walletRepository.findWalletByUserId(userId);

        if (!wallet) {
            throw new Error("Wallet not found");
        }

        //---------------------------------
        // Lock Information
        //---------------------------------

        const lockAmount =
            calculateLockAmount(
                side,
                price,
                quantity
            );

        const asset =
            getLockAsset(
                side,
                tradingPair
            );

        //---------------------------------
        // Transaction
        //---------------------------------

        const order = await prisma.$transaction(async (tx) => {

            await walletService.lockBalance(
                tx,
                wallet.id,
                asset.id,
                lockAmount
            );

            const createdOrder =
                await orderRepository.createOrder(
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

            return createdOrder;

        });

        //---------------------------------
        // Start Matching Engine
        //---------------------------------

        await matchingService.match(order.id);

        return await orderRepository.findOrderById(order.id);

    }

    async cancelOrder(orderId, userId) {

        const order =
            await orderRepository.findOrderById(orderId);

        if (!order) {
            throw new Error("Order not found");
        }

        if (order.userId !== userId) {
            throw new Error("Unauthorized");
        }

        if (
            order.status === "FILLED" ||
            order.status === "CANCELLED"
        ) {
            throw new Error(
                `Cannot cancel ${order.status.toLowerCase()} order`
            );
        }

        return await prisma.$transaction(async (tx) => {

            const walletId = order.user.wallet.id;

            if (order.side === "BUY") {

                const unlockAmount =
                    new Prisma.Decimal(order.remainingQuantity)
                        .mul(order.price);

                await walletService.unlockBalance(
                    tx,
                    walletId,
                    order.tradingPair.quoteAssetId,
                    unlockAmount
                );

            } else {

                await walletService.unlockBalance(
                    tx,
                    walletId,
                    order.tradingPair.baseAssetId,
                    order.remainingQuantity
                );

            }

            return await orderRepository.updateOrder(
                tx,
                order.id,
                {
                    status: "CANCELLED"
                }
            );

        });

    }

    async getOrders(userId) {

        return await orderRepository.findOrdersByUser(userId);

    }

    async getOrder(orderId) {

        const order =
            await orderRepository.findOrderById(orderId);

        if (!order) {
            throw new Error("Order not found");
        }

        return order;

    }

    async getOpenOrders(userId) {

        return await orderRepository.findOpenOrders(userId);

    }

    async getOrderHistory(userId) {

        return await orderRepository.findOrderHistory(userId);

    }

}

export default new OrderService();