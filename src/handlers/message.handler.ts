import type { IoType, SocketType } from "./index.js";
import {EVENTS} from "../constants/events.js";

export function registerMessageHandlers(io: IoType, socket: SocketType){
    socket.on(EVENTS.MESSAGE, (data) => {
        socket.broadcast.emit(EVENTS.MESSAGE, {
            from: socket.data.user.userId,
            message: data
        })
    })

    socket.on(EVENTS.SEND_DM, (data) => {
        io.to(data.toUserId).emit(EVENTS.RECEIVE_DM, {
            from: socket.data.user.name,
            message: data.message
        })
    })
}