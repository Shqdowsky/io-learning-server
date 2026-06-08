import {EVENTS} from "../constants/events.js";
import type { IUserPayload } from "./user.types.js";

export interface ServerToClientEvents  {
    [EVENTS.WELCOME]: (message: string) => void;
    [EVENTS.ROOM_JOINED]: (data: { room: string; memberId: string; message: string }) => void;
    [EVENTS.ROOM_LEFT]: (data: { memberId: string; message: string }) => void;
    [EVENTS.MESSAGE]: (data: { from: string; message: string }) => void;
    [EVENTS.RECEIVE_DM]: (data: { from: string; message: string }) => void;
}

export interface ClientToServerEvents  {
    [EVENTS.JOIN_ROOM]: (room: string ) => void;
    [EVENTS.LEAVE_ROOM]: (room: string) => void;
    [EVENTS.MESSAGE]: (data: string ) => void;
    [EVENTS.SEND_DM]: (data: { toUserId: string; message: string }) => void;
}

export interface SocketData {
    user: IUserPayload
}