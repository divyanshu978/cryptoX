import prisma from "../../config/prisma.js";

class TradeRepository {

    async createTrade(tx, data) {
        return tx.trade.create({
            data
        });
    }

    async getTradeById(id) {
        return prisma.trade.findUnique({
            where: { id }
        });
    }

    async getTradesByPair(tradingPairId) {
        return prisma.trade.findMany({
            where: {
                tradingPairId
            },
            orderBy: {
                createdAt: "desc"
            }
        });
    }

    async getTradesByUser(userId) {
        return prisma.trade.findMany({
            where: {
                OR: [
                    { buyerId: userId },
                    { sellerId: userId }
                ]
            },
            orderBy: {
                createdAt: "desc"
            }
        });
    }

}

export default new TradeRepository();