import express from "express";
import cors from "cors";

import errorMiddleware from "./middleware/error.middleware.js";

import authRoutes from "./modules/auth/auth.route.js";
import walletRoutes from "./modules/wallet/index.js";
import orderRoutes from "./modules/orders/order.route.js";
import orderBookRoutes
    from "./modules/order-book/order-book.routes.js";

const app = express();


// Middleware
app.use(cors());
app.use(express.json());


// Health Check
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "CryptoX API Running"
    });
});


// API Routes
app.use("/api/auth", authRoutes);

app.use("/api/wallet", walletRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/orderbook",orderBookRoutes
);


// Error Middleware
app.use(errorMiddleware);


export default app;