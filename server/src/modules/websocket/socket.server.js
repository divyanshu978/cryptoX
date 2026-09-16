import { Server } from "socket.io";

let io;

export function initializeSocket(server) {

    io = new Server(server, {
        cors: {
            origin: "*"
        }
    });

    io.on("connection", (socket) => {

        console.log(
            `WebSocket connected: ${socket.id}`
        );

        //-----------------------------------------
        // Subscribe to market
        //-----------------------------------------

        socket.on("market:subscribe", (symbol) => {

            if (!symbol) {
                return;
            }

            const normalizedSymbol =
                symbol.toUpperCase();

            const room =
                `market:${normalizedSymbol}`;

            socket.join(room);

            console.log(
                `${socket.id} joined ${room}`
            );

            socket.emit("market:subscribed", {
                symbol: normalizedSymbol
            });
        });


        //-----------------------------------------
        // Unsubscribe from market
        //-----------------------------------------

        socket.on("market:unsubscribe", (symbol) => {

            if (!symbol) {
                return;
            }

            const normalizedSymbol =
                symbol.toUpperCase();

            const room =
                `market:${normalizedSymbol}`;

            socket.leave(room);

            console.log(
                `${socket.id} left ${room}`
            );

            socket.emit("market:unsubscribed", {
                symbol: normalizedSymbol
            });
        });


        //-----------------------------------------
        // Disconnect
        //-----------------------------------------

        socket.on("disconnect", () => {

            console.log(
                `WebSocket disconnected: ${socket.id}`
            );
        });

    });

    return io;
}


export function getIO() {

    if (!io) {
        throw new Error(
            "Socket.IO has not been initialized"
        );
    }

    return io;
}