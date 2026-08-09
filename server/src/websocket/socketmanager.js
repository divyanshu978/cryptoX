import { getIO } from "./socket.js";

class SocketManager {

    joinMarket(socket, symbol) {

        const room = `market:${symbol}`;

        socket.join(room);

        console.log(
            `${socket.id} joined ${room}`
        );

        return room;
    }

    leaveMarket(socket, symbol) {

        const room = `market:${symbol}`;

        socket.leave(room);

        console.log(
            `${socket.id} left ${room}`
        );
    }

    joinPortfolio(socket, userId) {

        const room = `portfolio:${userId}`;

        socket.join(room);

        console.log(
            `${socket.id} joined ${room}`
        );

        return room;
    }

    leavePortfolio(socket, userId) {

        const room = `portfolio:${userId}`;

        socket.leave(room);
    }

    broadcastMarket(symbol, event, data) {

        const io = getIO();

        io.to(`market:${symbol}`).emit(
            event,
            data
        );
    }

    broadcastPortfolio(userId, event, data) {

        const io = getIO();

        io.to(`portfolio:${userId}`).emit(
            event,
            data
        );
    }

    broadcastAll(event, data) {

        const io = getIO();

        io.emit(event, data);
    }

}

export default new SocketManager();