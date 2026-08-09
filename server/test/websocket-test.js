import { io } from "socket.io-client";

const socket = io(
    "http://localhost:5000"
);

socket.on("connect", () => {

    console.log(
        "Connected:",
        socket.id
    );

    socket.emit(
        "market:subscribe",
        "BTCUSDT"
    );
});


socket.on(
    "market:subscribed",
    (data) => {

        console.log(
            "Subscribed:",
            data
        );
    }
);


socket.on("disconnect", () => {

    console.log(
        "Disconnected"
    );
});