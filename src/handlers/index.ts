import type { Server, Socket } from "socket.io";
import type { ClientToServerEvents, ServerToClientEvents, SocketData } from "../types/socket.types.js";
import {EVENTS} from "../constants/events.js";
import { registerRoomHandlers } from "./room.handler.js";
import { registerMessageHandlers } from "./message.handler.js";
import { handleDisconnecting } from "../service/room.service.js";

export type IoType = Server<ClientToServerEvents, ServerToClientEvents, {}, SocketData>;
export type SocketType = Socket<ClientToServerEvents, ServerToClientEvents, {}, SocketData>;

export function registerHandlers(io: IoType, socket: SocketType){
    const {name} = socket.data.user;
    socket.join(socket.data.user.userId);

    socket.emit(EVENTS.WELCOME,  `Welcome ${name!}`);

    registerMessageHandlers(io, socket);
    registerRoomHandlers(io, socket);

    socket.on("disconnecting", () => {
        handleDisconnecting(socket);
    });
}