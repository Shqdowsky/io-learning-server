import { Router } from "express";
import mongoose from "mongoose";
import { register, login } from "../service/auth.service.js";
import { AppError } from "../types/errors.js";

const router = Router();

router.post("/register", async (req, res) => {
    try{
        const {name, email, password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({message: "Name, email and password are required"});
        }
        await register(name, email, password);
        return res.status(201).send("Registered successfully")
    }catch(error){
        console.error(error)
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        if (error instanceof mongoose.mongo.MongoServerError && error.code === 11000) {
            return res.status(409).json({ message: "Email already registered" })
        }
    }
});
router.post("/login", async(req,res)=>{
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({message: "Email and password are required"});
        }
        const {token, user} = await login(email, password);
        return res.json({ ok: true, user, token })
    }catch(error){
        console.error(error)
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        return res.status(500).json({ message: "Some unpredictable login error occured" });
    }
});

export default router;