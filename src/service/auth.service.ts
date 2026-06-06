import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { AppError } from "../types/errors.js";
import { env } from "../config/env.js";

export async function register(name: string, email: string, password: string){
    const hashpass = await bcrypt.hash(password, 3);
    await User.create({name, email, password: hashpass});
}
export async function login(email: string, password: string){
    const candidate = await User.findOne({email});
    if(!candidate){
        throw new AppError("Such user doesn't exist", 400);
    }
    const isPassEquals = await bcrypt.compare(password, candidate.password);
    if(!isPassEquals){
        throw new AppError("Pasword doesn't match", 400);
    }
    const token = jwt.sign(
        {
            userId: candidate._id,
            name: candidate.name,
            email: candidate.email,
            role: candidate.role
        },
        env.JWT_SECRET,
        { expiresIn: '1h' }
    )
    return {token, user: {
        id: candidate._id,
        name: candidate.name,
        email: candidate.email,
        role: candidate.role
    }}
}