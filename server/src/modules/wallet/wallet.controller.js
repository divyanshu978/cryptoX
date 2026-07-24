import walletService from "./wallet.service.js";

class WalletController {

    async getWallet(req, res, next) {
        try {
            const wallet = await walletService.getWallet(req.user.id);

            return res.status(200).json({
                success: true,
                data: wallet
            });

        } catch (error) {
            next(error);
        }
    }

    async deposit(req, res, next) {
        try {

            const { symbol, amount } = req.body;

            const result = await walletService.deposit(
                req.user.id,
                symbol,
                amount
            );

            return res.status(200).json({
                success: true,
                message: "Deposit successful",
                data: result
            });

        } catch (error) {

            next(error);
        }
    }

    async withdraw(req, res, next) {
    try {

        const { symbol, amount } = req.body;

        const result = await walletService.withdraw(
            req.user.id,
            symbol,
            amount
        );

        return res.status(200).json({
            success: true,
            message: "Withdrawal successful",
            data: result
        });

    } catch (error) {
        next(error);
    }
}
}

export default new WalletController();