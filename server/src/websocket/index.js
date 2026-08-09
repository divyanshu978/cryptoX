import { initializeSocket } from "./socket.js";
import socketManager from "./socketManager.js";

export const initializeWebSocket = (httpServer) => {

    const io = initializeSocket(httpServer);

    io.on("connection", (socket) => {

        socket.on("join_market", (symbol) => {

            if (!symbol) {
                return;
            }

            socketManager.joinMarket(
                socket,
                symbol.toUpperCase()
            );

        });

        socket.on("leave_market", (symbol) => {

            if (!symbol) {
                return;
            }

            socketManager.leaveMarket(
                socket,
                symbol.toUpperCase()
            );

        });

        socket.on("join_portfolio", (userId) => {

            if (!userId) {
                return;
            }

            socketManager.joinPortfolio(
                socket,
                userId
            );

        });

        socket.on("leave_portfolio", (userId) => {

            if (!userId) {
                return;
            }

            socketManager.leavePortfolio(
                socket,
                userId
            );

        });

    });

    return io;
};