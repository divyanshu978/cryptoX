import eventBus from "../eventBus.js";
import EVENTS from "../event.js";

import socketManager from "../../websocket/socketManager.js";

class MarketSubscriber {

    initialize() {

        eventBus.on(
            EVENTS.TRADE_EXECUTED,
            this.handleTradeExecuted.bind(this)
        );

        eventBus.on(
            EVENTS.ORDER_CREATED,
            this.handleOrderCreated.bind(this)
        );

        eventBus.on(
            EVENTS.ORDER_CANCELLED,
            this.handleOrderCancelled.bind(this)
        );

        console.log("Market subscriber initialized");
    }

    handleTradeExecuted(trade) {

        if (!trade) {
            return;
        }

        const symbol =
            trade.tradingPair?.symbol ||
            trade.symbol;

        if (!symbol) {
            console.error(
                "Trading pair symbol missing in trade event"
            );

            return;
        }

        socketManager.broadcastMarket(
            symbol,
            "trade_executed",
            {
                id: trade.id,

                price: trade.price,

                quantity: trade.quantity,

                buyOrderId: trade.buyOrderId,

                sellOrderId: trade.sellOrderId,

                buyerId: trade.buyerId,

                sellerId: trade.sellerId,

                createdAt: trade.createdAt
            }
        );
    }

    handleOrderCreated(order) {

        if (!order) {
            return;
        }

        const symbol =
            order.tradingPair?.symbol;

        if (!symbol) {
            return;
        }

        socketManager.broadcastMarket(
            symbol,
            "order_created",
            {
                orderId: order.id,

                side: order.side,

                type: order.type,

                price: order.price,

                quantity: order.quantity,

                remainingQuantity:
                    order.remainingQuantity,

                status: order.status
            }
        );
    }

    handleOrderCancelled(order) {

        if (!order) {
            return;
        }

        const symbol =
            order.tradingPair?.symbol;

        if (!symbol) {
            return;
        }

        socketManager.broadcastMarket(
            symbol,
            "order_cancelled",
            {
                orderId: order.id,

                side: order.side,

                price: order.price,

                remainingQuantity:
                    order.remainingQuantity,

                status: order.status
            }
        );
    }
}

export default new MarketSubscriber();