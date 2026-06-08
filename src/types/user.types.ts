import type { Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: string;
}

export interface IUserPayload {
    userId: string,
    name: string,
    email: string,
    role: string
}