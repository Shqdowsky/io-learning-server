import { io, Socket } from "socket.io-client";
import axios from "axios";
import * as readline from "readline";
import { EVENTS } from "../constants/events.js";
import { socketConfig } from "../config/socket.js";
import type { ServerToClientEvents, ClientToServerEvents } from "../types/socket.types.js";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (prompt: string): Promise<string> =>
    new Promise(resolve => rl.question(prompt, resolve));

const email = await question("Email: ");
const password = await question("Password: ");

const { data } = await axios.post("http://localhost:3000/auth/login", { email, password });
const token = data.token;
console.log("Logged in successfully");

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io("http://localhost:3000", {
    auth: {token},
    ...socketConfig
});

socket.on("connect", () => {
    console.log("Connected:", socket.id);
    showMenu();
});

socket.on(EVENTS.WELCOME, (message) => {
    console.log(message)
});

socket.on(EVENTS.ROOM_JOINED, (data) => {
    console.log(`[ROOM] ${data.message}`);
});

socket.on(EVENTS.ROOM_LEFT, (data) => {
    console.log(`[ROOM] ${data.message}`);
});

socket.on(EVENTS.MESSAGE, (data) => {
    console.log(`[MSG] ${data.from}: ${data.message}`);
});

socket.on(EVENTS.RECEIVE_DM, (data) => {
    console.log(`[DM] from ${data.from}: ${data.message}`);
});

socket.on("disconnect", (reason) => {
    console.log("Disconnected:", reason);
});

socket.io.on("reconnect_attempt", (attempt) => {
    console.log(`Reconnecting... attempt ${attempt}`);
});

socket.on("connect_error", (err) => {
    console.log("Auth failed:", err.message);
    process.exit(1);
});

async function showMenu() {
    while (true) {
        console.log("\n1. Join room");
        console.log("2. Leave room");
        console.log("3. Send message");
        console.log("4. Send DM");
        console.log("5. Exit");

        const choice = await question("\nChoice: ");

        switch (choice.trim()) {
            case "1": {
                const room = await question("Room name: ");
                socket.emit(EVENTS.JOIN_ROOM,  room );
                break;
            }
            case "2": {
                const room = await question("Room name: ");
                socket.emit(EVENTS.LEAVE_ROOM, room );
                break;
            }
            case "3": {
                const message = await question("Message: ");
                socket.emit(EVENTS.MESSAGE, message );
                break;
            }
            case "4": {
                const toUserId = await question("User ID: ");
                const message = await question("Message: ");
                socket.emit(EVENTS.SEND_DM, { toUserId, message });
                break;
            }
            case "5": {
                rl.close();
                process.exit(0);
            }
            default:
                console.log("Invalid choice");
        }
    }
}