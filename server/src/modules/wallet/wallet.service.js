import { Prisma } from "@prisma/client";
import prisma from "../../config/prisma.js";
import walletRepository from "./wallet.repository.js";

class WalletService {
    /**
     * Get complete wallet with balances
     */
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

    /**
     * Deposit funds
     */
    async deposit(userId, symbol, amount) {
        if (!amount || Number(amount) <= 0) {
            throw new Error("Invalid amount");
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
            const previousBalance = await this.getOrCreateBalance(
                tx,
                wallet.id,
                asset.id
            );

            const updatedBalance = await this.creditBalance(
                tx,
                wallet.id,
                asset.id,
                amount
            );

            await walletRepository.createTransaction(tx, {
                walletId: wallet.id,
                assetId: asset.id,

                type: "DEPOSIT",
                status: "SUCCESS",

                amount: new Prisma.Decimal(amount),

                balanceBefore: previousBalance.available,
                balanceAfter: updatedBalance.available,

                referenceType: "SYSTEM",

                description: "Manual Deposit",
            });

            return {
                asset: asset.symbol,
                available: updatedBalance.available,
                locked: updatedBalance.locked,
            };
        });
    }

    /**
     * Withdraw funds
     */
    async withdraw(userId, symbol, amount) {

        if (!amount || Number(amount) <= 0) {
            throw new Error("Invalid amount");
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

            const previousBalance = await this.getBalance(
                tx,
                wallet.id,
                asset.id
            );

            const updatedBalance = await this.debitBalance(
                tx,
                wallet.id,
                asset.id,
                amount
            );

            await walletRepository.createTransaction(tx, {
                walletId: wallet.id,
                assetId: asset.id,

                type: "WITHDRAW",
                status: "SUCCESS",

                amount: new Prisma.Decimal(amount),

                balanceBefore: previousBalance.available,
                balanceAfter: updatedBalance.available,

                referenceType: "SYSTEM",

                description: "Manual Withdrawal"
            });

            return {
                asset: asset.symbol,
                available: updatedBalance.available,
                locked: updatedBalance.locked
            };

        });

    }

    /**
     * Get Wallet Balance
     */
    async getBalance(tx, walletId, assetId) {
        const balance = await walletRepository.findWalletBalance(
            tx,
            walletId,
            assetId
        );

        if (!balance) {
            throw new Error("Wallet balance not found");
        }

        return balance;
    }

    /**
     * Get existing balance or create a new balance row
     */
    async getOrCreateBalance(tx, walletId, assetId) {
        let balance = await walletRepository.findWalletBalance(
            tx,
            walletId,
            assetId
        );

        if (!balance) {
            balance = await walletRepository.createWalletBalance(tx, {
                walletId,
                assetId,
                available: new Prisma.Decimal(0),
                locked: new Prisma.Decimal(0),
            });
        }

        return balance;
    }

    /**
     * Increase available balance
     */
    async creditBalance(tx, walletId, assetId, amount) {
        const balance = await this.getOrCreateBalance(
            tx,
            walletId,
            assetId
        );

        const available = new Prisma.Decimal(balance.available).plus(amount);

        return walletRepository.updateWalletBalance(tx, balance.id, {
            available,
        });
    }

    /**
     * Decrease available balance
     */
    async debitBalance(tx, walletId, assetId, amount) {
        const balance = await this.getBalance(
            tx,
            walletId,
            assetId
        );

        if (balance.available.lessThan(amount)) {
            throw new Error("Insufficient balance");
        }

        const available = new Prisma.Decimal(balance.available).minus(amount);

        return walletRepository.updateWalletBalance(tx, balance.id, {
            available,
        });
    }

    /**
     * Move funds from available -> locked
     */
    async lockBalance(tx, walletId, assetId, amount) {
        const balance = await this.getBalance(
            tx,
            walletId,
            assetId
        );

        if (balance.available.lessThan(amount)) {
            throw new Error("Insufficient balance");
        }

        const available = new Prisma.Decimal(balance.available).minus(amount);

        const locked = new Prisma.Decimal(balance.locked).plus(amount);

        return walletRepository.updateWalletBalance(tx, balance.id, {
            available,
            locked,
        });
    }

    /**
     * Move funds from locked -> available
     */
    async unlockBalance(tx, walletId, assetId, amount) {
        const balance = await this.getBalance(
            tx,
            walletId,
            assetId
        );

        if (balance.locked.lessThan(amount)) {
            throw new Error("Insufficient locked balance");
        }

        const available = new Prisma.Decimal(balance.available).plus(amount);

        const locked = new Prisma.Decimal(balance.locked).minus(amount);

        return walletRepository.updateWalletBalance(tx, balance.id, {
            available,
            locked,
        });
    }
    async consumeLockedBalance(tx, walletId, assetId, amount) {

        const walletBalance = await tx.walletBalance.findUnique({
            where: {
                walletId_assetId: {
                    walletId,
                    assetId
                }
            }
        });

        if (!walletBalance) {
            throw new Error("Wallet balance not found");
        }

        const locked = new Prisma.Decimal(walletBalance.locked);
        const consumeAmount = new Prisma.Decimal(amount);

        if (locked.lessThan(consumeAmount)) {
            throw new Error("Insufficient locked balance");
        }

        const updatedWalletBalance = await tx.walletBalance.update({
            where: {
                walletId_assetId: {
                    walletId,
                    assetId
                }
            },
            data: {
                locked: locked.minus(consumeAmount)
            }
        });

        return updatedWalletBalance;
    }

}

export default new WalletService();