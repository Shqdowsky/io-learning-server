import  jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import type { AppJwtPayload } from "../types/auth.types.js";

function isJwtPayload(payload: unknown): payload is AppJwtPayload{
    return typeof payload === "object" && payload !== null && "userId" in payload;
}

export function verifyToken(token: string): AppJwtPayload {
    try {
        const decoded = jwt.verify(token, env.JWT_SECRET);
        if(!isJwtPayload(decoded)){
            throw new Error("Invalid token payload");
        }
        return decoded
    } catch (error) {
        console.log(error)
        throw new Error("Invalid or expired token");
    }
}