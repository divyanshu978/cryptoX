import prisma from "../../config/prisma.js";

class WalletRepository {

    async findWalletByUserId(userId) {
        return prisma.wallet.findUnique({
            where: { userId }
        });
    }

    async findAssetBySymbol(symbol) {
        return prisma.asset.findUnique({
            where: {
                symbol
            }
        });
    }

    async findWalletBalance(tx, walletId, assetId) {
        return tx.walletBalance.findUnique({
            where: {
                walletId_assetId: {
                    walletId,
                    assetId
                }
            }
        });
    }

    async createWalletBalance(tx, data) {
        return tx.walletBalance.create({
            data
        });
    }

    async updateWalletBalance(tx, id, data) {
        return tx.walletBalance.update({
            where: {
                id
            },
            data
        });
    }

    async createTransaction(tx, data) {
        return tx.transaction.create({
            data
        });
    }
}

export default new WalletRepository();