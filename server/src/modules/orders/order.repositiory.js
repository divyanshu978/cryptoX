import prisma from "../../config/prisma.js";

class OrderRepository {

    /**
     * Find Trading Pair
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
     * Create Order
     */
    async createOrder(tx, data) {
        return tx.order.create({
            data
        });
    }

    /**
     * Get Order By Id
     */
    async findOrderById(id) {
        return prisma.order.findUnique({
            where: {
                id
            },
            include: {
                user: {
                    include: {
                        wallet: true
                    }
                },
                tradingPair: {
                    include: {
                        baseAsset: true,
                        quoteAsset: true
                    }
                }
            }
        });
    }

    /**
     * Get Orders By User
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
     * Get Open Orders
     */
    async findOpenOrders(userId) {
        return prisma.order.findMany({
            where: {
                userId,
                status: {
                    in: ["OPEN", "PARTIALLY_FILLED"]
                }
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
     * Order History
     */
    async findOrderHistory(userId) {
        return prisma.order.findMany({
            where: {
                userId,
                status: {
                    in: [
                        "FILLED",
                        "CANCELLED"
                    ]
                }
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
     * Find Matching BUY Orders
     */
    async findMatchingBuyOrders(tx, tradingPairId, price) {

        return tx.order.findMany({

            where: {
                tradingPairId,
                side: "BUY",
                status: {
                    in: ["OPEN", "PARTIALLY_FILLED"]
                },
                price: {
                    gte: price
                }
            },

            include: {
                user: {
                    include: {
                        wallet: true
                    }
                },
                tradingPair: {
                    include: {
                        baseAsset: true,
                        quoteAsset: true
                    }
                }
            },

            orderBy: [
                {
                    price: "desc"
                },
                {
                    createdAt: "asc"
                }
            ]

        });

    }

    /**
     * Find Matching SELL Orders
     */
    async findMatchingSellOrders(tx, tradingPairId, price) {

        return tx.order.findMany({

            where: {
                tradingPairId,
                side: "SELL",
                status: {
                    in: ["OPEN", "PARTIALLY_FILLED"]
                },
                price: {
                    lte: price
                }
            },

            include: {
                user: {
                    include: {
                        wallet: true
                    }
                },
                tradingPair: {
                    include: {
                        baseAsset: true,
                        quoteAsset: true
                    }
                }
            },

            orderBy: [
                {
                    price: "asc"
                },
                {
                    createdAt: "asc"
                }
            ]

        });

    }

    /**
     * Update Order
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
     * Delete Order
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