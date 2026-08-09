import orderBookService from "./order-book.service.js";

class OrderBookController {

    async getOrderBook(req, res, next) {

        try {

            const { symbol } = req.params;

            const orderBook =
                await orderBookService.getOrderBook(
                    symbol
                );

            return res.status(200).json({
                success: true,
                data: orderBook
            });

        } catch (error) {

            next(error);

        }
    }
}

export default new OrderBookController();