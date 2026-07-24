import prisma from "../src/config/prisma.js";

async function main() {
    await prisma.asset.createMany({
        data: [
            {
                symbol: "BTC",
                name: "Bitcoin",
                network: "Bitcoin",
                decimals: 8,
            },
            {
                symbol: "ETH",
                name: "Ethereum",
                network: "Ethereum",
                decimals: 18,
            },
            {
                symbol: "USDT",
                name: "Tether USD",
                network: "Ethereum",
                decimals: 6,
            },
            {
                symbol: "SOL",
                name: "Solana",
                network: "Solana",
                decimals: 9,
            },
        ],
        skipDuplicates: true,
    });

    console.log("Assets seeded successfully.");
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });