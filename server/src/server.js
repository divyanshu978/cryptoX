import app from "./app.js";
import http from "http"

const PORT = 4000;

import { initializeWebSocket } from "./websocket/index.js";
import { initializeSubscribers } from "./events/subscribers/index.js";

const httpServer = http.createServer(app);

initializeWebSocket(httpServer);

initializeSubscribers();

httpServer.listen(5000, () => {

    console.log(
        "Server running on port 5000"
    );

});