import orderRepository from "../orders/order.repository.js";

class OrderBookService {

    async getOrderBook(symbol) {

        const tradingPair =
            await orderRepository.findTradingPairBySymbol(symbol);

        if (!tradingPair) {
            throw new Error("Trading pair not found");
        }

        const buyOrders =
            await orderRepository.findOpenBuyOrders(
                tradingPair.id
            );

        const sellOrders =
            await orderRepository.findOpenSellOrders(
                tradingPair.id
            );

        return {
            symbol: tradingPair.symbol,

            bids: buyOrders,

            asks: sellOrders
        };
    }
}

export default new OrderBookService();