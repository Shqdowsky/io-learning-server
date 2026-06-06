import mongoose from "mongoose";
import { type IUser } from "../types/user.types.js";

const userSchema = new mongoose.Schema({
    name: String,
    email: {type: String, unique: true},
    password: String,
    role: String
})

export default mongoose.model<IUser>('User', userSchema);