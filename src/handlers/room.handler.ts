import type { IoType, SocketType } from "./index.js";
import {EVENTS} from "../constants/events.js";
import { leaveRoom, joinRoom } from "../service/room.service.js";

export function registerRoomHandlers(io: IoType, socket: SocketType){
    socket.on(EVENTS.JOIN_ROOM, (room) => {
        joinRoom(io, socket, room)
    })
    
    socket.on(EVENTS.LEAVE_ROOM, (room) => {
        leaveRoom(socket, room)
    })
}