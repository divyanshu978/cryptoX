import orderService from "./order.service.js";
import { Prisma } from "@prisma/client";

class OrderController {

    /**
     * Place a new order
     * POST /orders
     */
    async placeOrder(req, res, next) {

        try {

            const order = await orderService.placeOrder(
                req.user.id,
                req.body
            );

            return res.status(201).json({
                success: true,
                message: "Order placed successfully",
                data: order
            });

        } catch (error) {
            next(error);
        }

    }

    /**
     * Cancel an order
     * DELETE /orders/:id
     */
    async cancelOrder(req, res, next) {

        try {

            const { id } = req.params;

            const order = await orderService.cancelOrder(
                id,
                req.user.id
            );

            return res.status(200).json({
                success: true,
                message: "Order cancelled successfully",
                data: order
            });

        } catch (error) {
            next(error);
        }

    }

    /**
     * Get order by ID
     * GET /orders/:id
     */
    async getOrderById(req, res, next) {

        try {

            const { id } = req.params;

            const order = await orderService.getOrderById(id);

            return res.status(200).json({
                success: true,
                data: order
            });

        } catch (error) {
            next(error);
        }

    }

    /**
     * Get all orders of logged-in user
     * GET /orders
     */
    async getMyOrders(req, res, next) {

        try {

            const orders = await orderService.getOrdersByUser(
                req.user.id
            );

            return res.status(200).json({
                success: true,
                count: orders.length,
                data: orders
            });

        } catch (error) {
            next(error);
        }

    }

    /**
     * Get Open Orders
     * GET /orders/open
     */
    async getOpenOrders(req, res, next) {

        try {

            const orders = await orderService.getOpenOrders(
                req.user.id
            );

            return res.status(200).json({
                success: true,
                count: orders.length,
                data: orders
            });

        } catch (error) {
            next(error);
        }

    }

    /**
     * Get Order History
     * GET /orders/history
     */
    async getOrderHistory(req, res, next) {

        try {

            const orders = await orderService.getOrderHistory(
                req.user.id
            );

            return res.status(200).json({
                success: true,
                count: orders.length,
                data: orders
            });

        } catch (error) {
            next(error);
        }

    }
}


export default new OrderController();