import { Router, type Request, type Response } from "express";
import mongoose from "mongoose";
import { register, login } from "../service/auth.service.js";
import { AppError } from "../types/errors.js";
import type { AuthResult, ReqBody } from "../types/auth.types.js";
import type { ErrorResponse } from "../types/errors.js";

const router = Router();

type TypedRequest<B = {}, P extends Record<string, string> = {}, Q = {}> 
  = Request<P, any, B, Q>;

router.post("/register", async (req: TypedRequest<ReqBody>, res: Response): Promise<void> => {
    try{
        const {name, email, password} = req.body;
        if(!name || !email || !password){
            res.status(400).json({message: "Name, email and password are required"});
            return;
        }
        await register(name, email, password);
        res.status(201).send("Registered successfully");
    }catch(error){
        console.error(error)
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });
            return;
        }
        if (error instanceof mongoose.mongo.MongoServerError && error.code === 11000) {
            res.status(409).json({ message: "Email already registered" });
            return;
        }
        res.status(500).json({ message: "Unexpected registration error" });
    }
});
router.post("/login", async(req: TypedRequest<Omit<ReqBody, 'name'>>, res: Response<AuthResult | ErrorResponse>): Promise<void> =>{
    try{
        const {email, password} = req.body;
        if(!email || !password){
            res.status(400).json({message: "Email and password are required"});
            return
        }
        const {token, user} = await login(email, password);
        res.json({ token, user })
    }catch(error){
        console.error(error)
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });
            return
        }
        res.status(500).json({ message: "Unexpected login error" });
    }
});

export default router;