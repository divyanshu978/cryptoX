import { Prisma } from "@prisma/client";

export function calculateLockAmount(side, price, quantity) {

    const orderPrice = new Prisma.Decimal(price);
    const orderQuantity = new Prisma.Decimal(quantity);

    if (side === "BUY") {
        return orderPrice.mul(orderQuantity);
    }

    if (side === "SELL") {
        return orderQuantity;
    }

    throw new Error("Invalid order side");
}


export function getLockAsset(side, tradingPair) {

    if (side === "BUY") {
        return tradingPair.quoteAsset;
    }

    if (side === "SELL") {
        return tradingPair.baseAsset;
    }

    throw new Error("Invalid order side");
}