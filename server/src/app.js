import express from "express";
import cors from "cors";
import errorMiddleware from "./middleware/error.middleware.js";
import authRoutes from "./modules/auth/auth.route.js";
import walletRoutes from "./modules/wallet/index.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "CryptoX API Running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/wallet", walletRoutes);

export default app;