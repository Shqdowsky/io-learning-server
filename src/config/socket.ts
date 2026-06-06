import type { ManagerOptions, SocketOptions } from "socket.io-client";

export const socketConfig: Partial<ManagerOptions & SocketOptions> = {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 3000,
    randomizationFactor: 0.5,
    reconnectionAttempts: 10,
    transports: ["websocket"]
};