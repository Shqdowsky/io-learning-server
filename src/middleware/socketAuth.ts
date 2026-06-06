import { type Socket } from "socket.io";
import type{ ClientToServerEvents, ServerToClientEvents, SocketData } from "../types/socket.types.js";
import { verifyToken } from "../utils/verifyToken.js";

type AuthToken = Socket<ClientToServerEvents, ServerToClientEvents, {}, SocketData>

export function socketAuth(socket: AuthToken, next: (error?: Error) => void){
    const token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error("No token provided"));
    }
    try{
        const payload = verifyToken(token);
        socket.data.user = {
            userId: payload.userId,
            name: payload.name,
            email: payload.email,
            role: payload.role
        };
        next();
    }catch(error){
        next(new Error("Invalid or expired token"));
    }
}