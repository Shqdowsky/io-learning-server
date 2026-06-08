import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { AppError } from "../types/errors.js";
import { env } from "../config/env.js";
import type { AuthResult, AppJwtPayload } from "../types/auth.types.js";

export async function register(name: string, email: string, password: string){
    const hashpass = await bcrypt.hash(password, 3);
    await User.create({name, email, password: hashpass});
}
export async function login(email: string, password: string): Promise<AuthResult>{
    const candidate = await User.findOne({email});
    if(!candidate){
        throw new AppError("Such user doesn't exist", 400);
    }
    const isPassEquals = await bcrypt.compare(password, candidate.password);
    if(!isPassEquals){
        throw new AppError("Pasword doesn't match", 400);
    }
    const payload: AppJwtPayload = {
        userId: candidate._id.toString(),
        name: candidate.name,
        email: candidate.email,
        role: candidate.role
    }
    const token = jwt.sign(
        payload,
        env.JWT_SECRET,
        { expiresIn: '1h' }
    )
    return {token, user: {
        userId: candidate._id.toString(),
        name: candidate.name,
        email: candidate.email,
        role: candidate.role
    }}
}