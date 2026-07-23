import walletRepository from "./wallet.repository.js";

class WalletService {
    async getWallet(userId) {
        const wallet = await walletRepository.findWalletByUserId(userId);

        if (!wallet) {
            throw new Error("Wallet not found");
        }

        return {
            walletId: wallet.id,
            balances: wallet.balances.map((balance) => ({
                assetId: balance.asset.id,
                symbol: balance.asset.symbol,
                name: balance.asset.name,
                available: balance.available,
                locked: balance.locked,
            })),
        };
    }

    async deposit(userId, symbol, amount) {

        if (!amount || Number(amount) <= 0) {
            throw new Error("Invalid deposit amount");
        }

        const wallet = await walletRepository.findWalletByUserId(userId);

        if (!wallet) {
            throw new Error("Wallet not found");
        }

        const asset = await walletRepository.findAssetBySymbol(symbol);

        if (!asset) {
            throw new Error("Asset not found");
        }

        return prisma.$transaction(async (tx) => {

        });

        const walletBalance =
            await walletRepository.findWalletBalance(
                tx,
                wallet.id,
                asset.id
            );

        await walletRepository.updateWalletBalance(
            tx,
            walletBalance.id,
            {
                available: updatedAvailable
            }
        );
        await walletRepository.createWalletBalance(
            tx,
            {
                walletId: wallet.id,
                assetId: asset.id,
                available: new Prisma.Decimal(amount),
                locked: new Prisma.Decimal(0)
            }
        );
        await walletRepository.createTransaction(tx, {
            walletId: wallet.id,
            assetId: asset.id,
            type: "DEPOSIT",
            status: "SUCCESS",
            amount: new Prisma.Decimal(amount),
            balanceBefore: previousBalance,
            balanceAfter: updatedBalance,
            referenceType: "SYSTEM",
            description: "Manual deposit"
        });

        return {
            asset: asset.symbol,
            available: updatedBalance.toString()
        };

    }
}

export default new WalletService();