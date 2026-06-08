import { Server } from "socket.io";
import httpserver from "./app.js";
import type{ ServerToClientEvents, ClientToServerEvents, SocketData } from "./types/socket.types.js";
import { socketAuth } from "./middleware/socketAuth.js";
import {connectDB} from "./config/db.js"
import { registerHandlers } from "./handlers/index.js";

const io = new Server<ClientToServerEvents, ServerToClientEvents, {}, SocketData>(httpserver);

io.use(socketAuth);

io.on("connection", (socket) => {
    registerHandlers(io, socket);
});

await connectDB();

httpserver.listen(3000, () => {
    console.log("Server running on port 3000");
});