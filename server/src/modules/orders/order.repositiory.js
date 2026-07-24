import prisma from "../../config/prisma.js";

class OrderRepository {

    /**
     * Find trading pair by symbol
     * Example: BTCUSDT
     */
    async findTradingPairBySymbol(symbol) {
        return prisma.tradingPair.findUnique({
            where: {
                symbol
            },
            include: {
                baseAsset: true,
                quoteAsset: true
            }
        });
    }

    /**
     * Create new order
     */
    async createOrder(tx, data) {
        return tx.order.create({
            data
        });
    }

    /**
     * Find order by id
     */
    async findOrderById(id) {
        return prisma.order.findUnique({
            where: {
                id
            },
            include: {
                tradingPair: true
            }
        });
    }

    /**
     * Get all orders of a user
     */
    async findOrdersByUser(userId) {
        return prisma.order.findMany({
            where: {
                userId
            },
            include: {
                tradingPair: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });
    }

    /**
     * Update order
     */
    async updateOrder(tx, id, data) {
        return tx.order.update({
            where: {
                id
            },
            data
        });
    }

    /**
     * Delete order
     */
    async deleteOrder(tx, id) {
        return tx.order.delete({
            where: {
                id
            }
        });
    }
}

export default new OrderRepository();