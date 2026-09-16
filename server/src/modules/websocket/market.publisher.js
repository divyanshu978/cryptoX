import { getIO } from "./socket.server.js";

class MarketPublisher {

    /**
     * Broadcast a completed trade
     * to all clients subscribed to the pair.
     */
    publishTrade(trade) {

        const io = getIO();

        const symbol =
            trade.tradingPair.symbol;

        const room =
            `market:${symbol}`;

        io.to(room).emit(
            "market:trade",
            {
                tradeId: trade.id,

                symbol,

                price: trade.price,

                quantity: trade.quantity,

                buyOrderId: trade.buyOrderId,

                sellOrderId: trade.sellOrderId,

                timestamp: trade.createdAt
            }
        );
    }
}

export default new MarketPublisher();