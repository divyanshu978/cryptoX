import { Server } from "socket.io";

let io;

export const initializeSocket = (httpServer) => {

    io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {

        console.log(`Socket connected: ${socket.id}`);

        socket.on("disconnect", (reason) => {
            console.log(
                `Socket disconnected: ${socket.id} - ${reason}`
            );
        });

    });

    console.log("Socket.IO server initialized");

    return io;
};

export const getIO = () => {

    if (!io) {
        throw new Error("Socket.IO has not been initialized");
    }

    return io;
};