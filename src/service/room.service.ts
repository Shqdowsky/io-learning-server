import type{Server, Socket} from "socket.io";
import type { ClientToServerEvents, ServerToClientEvents, SocketData } from "../types/socket.types.js";
import { EVENTS } from "../constants/events.js";

type IoType = Server<ClientToServerEvents, ServerToClientEvents, {}, SocketData>;
type SocketType = Socket<ClientToServerEvents, ServerToClientEvents, {}, SocketData>;

export function getRoomMembers(io: IoType, room: string): string[]{
    const members = io.sockets.adapter.rooms.get(room);
    return members ? Array.from(members) : [];
}

export function getRoomCount(io: IoType, room: string): number {
    return io.sockets.adapter.rooms.get(room)?.size || 0;
}

export function joinRoom(io: IoType, socket: SocketType, room: string){
    socket.join(room);
    const memberCount = getRoomCount(io, room);
    socket.emit(EVENTS.ROOM_JOINED, {
        room,
        memberId: socket.id,
        message: `${socket.data.user.name} joined the room`
    });

    socket.emit(EVENTS.WELCOME, 
        `Joined ${room} — ${memberCount} member${memberCount === 1 ? "" : "s"} online`
    );
}

export function leaveRoom(socket: SocketType, room: string){
    socket.leave(room);
    socket.to(room).emit(EVENTS.ROOM_LEFT, {
        memberId: socket.id,
        message: `${socket.data.user.name} left the room`
    })
}

export function handleDisconnecting(socket: SocketType) {
    for (const room of socket.rooms) {
        if (room !== socket.id) {
            socket.to(room).emit(EVENTS.ROOM_LEFT, {
                memberId: socket.id,
                message: `${socket.data.user.name} disconnected`
            });
        }
    }
}