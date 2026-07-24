import { Prisma } from "@prisma/client";
import prisma from "../../config/prisma.js";

import orderRepository from "./order.repository.js";
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

    }

    async cancelOrder(userId, orderId) {

    }

    async getOrders(userId) {

    }

    async getOrder(orderId) {

    }

}

export default new OrderService();