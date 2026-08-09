import prisma from "../../config/prisma.js";
import orderRepository from "../orders/order.repository.js";
import { Prisma } from "@prisma/client";
import tradeService from "../trade/trade.service.js";

class MatchingService {

    async match(orderId) {

    let incomingOrder =
        await orderRepository.findOrderById(orderId);

    if (!incomingOrder) {
        throw new Error("Order not found");
    }

    while (
        incomingOrder.remainingQuantity.greaterThan(0) &&
        incomingOrder.status !== "FILLED"
    ) {

        //----------------------------------
        // Find best opposite order
        //----------------------------------

        let candidates;

        if (incomingOrder.side === "BUY") {

            candidates =
                await orderRepository.findMatchingSellOrders(
                    prisma,
                    incomingOrder.tradingPairId,
                    incomingOrder.price
                );

        } else {

            candidates =
                await orderRepository.findMatchingBuyOrders(
                    prisma,
                    incomingOrder.tradingPairId,
                    incomingOrder.price
                );
        }

        //----------------------------------
        // No Match
        //----------------------------------

        if (candidates.length === 0) {
            break;
        }

        //----------------------------------
        // Best Match
        //----------------------------------

        const bestMatch = candidates[0];

        //----------------------------------
        // Calculate quantity
        //----------------------------------

        const tradeQuantity = Prisma.Decimal.min(
            incomingOrder.remainingQuantity,
            bestMatch.remainingQuantity
        );

        //----------------------------------
        // Trade Price
        //----------------------------------

        const tradePrice = bestMatch.price;

        //----------------------------------
        // Execute Settlement
        //----------------------------------

        await prisma.$transaction(async (tx) => {

            const latestIncoming =
                await orderRepository.findOrderById(
                    incomingOrder.id
                );

            const latestMatch =
                await orderRepository.findOrderById(
                    bestMatch.id
                );

            const buyOrder =
                latestIncoming.side === "BUY"
                    ? latestIncoming
                    : latestMatch;

            const sellOrder =
                latestIncoming.side === "SELL"
                    ? latestIncoming
                    : latestMatch;

            await tradeService.executeTrade({

                tx,

                buyOrder,

                sellOrder,

                quantity: tradeQuantity,

                price: tradePrice

            });

        });

        //----------------------------------
        // Reload incoming order
        //----------------------------------

        incomingOrder =
            await orderRepository.findOrderById(
                incomingOrder.id
            );
    }

    return incomingOrder;

}

}

export default new MatchingService();