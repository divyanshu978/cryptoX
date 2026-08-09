import prisma from "../src/config/prisma.js";

async function main() {

    //-----------------------------------------
    // Find BTC
    //-----------------------------------------

    const btc = await prisma.asset.findUnique({
        where: {
            symbol: "BTC"
        }
    });

    //-----------------------------------------
    // Find USDT
    //-----------------------------------------

    const usdt = await prisma.asset.findUnique({
        where: {
            symbol: "USDT"
        }
    });

    //-----------------------------------------
    // Validate assets
    //-----------------------------------------

    if (!btc) {
        throw new Error("BTC asset not found");
    }

    if (!usdt) {
        throw new Error("USDT asset not found");
    }

    //-----------------------------------------
    // Create Trading Pair
    //-----------------------------------------

    const tradingPair =
        await prisma.tradingPair.upsert({

            where: {
                symbol: "BTCUSDT"
            },

            update: {
                isActive: true
            },

            create: {

                symbol: "BTCUSDT",

                baseAssetId: btc.id,

                quoteAssetId: usdt.id,

                isActive: true,

                minOrderSize: "0.00001",

                maxOrderSize: "100",

                pricePrecision: 2,

                quantityPrecision: 8
            }
        });

    console.log(
        "Trading pair created:",
        tradingPair
    );
}

main()
    .catch((error) => {

        console.error(error);

        process.exit(1);

    })
    .finally(async () => {

        await prisma.$disconnect();

    });