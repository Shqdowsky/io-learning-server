import mongoose from "mongoose";
import { env } from "./env.js";


export async function connectDB() {
    try{
        await mongoose.connect(env.MONGO_URI);
        console.log("Connected to db succesfully")
    }catch(error){
        console.log(`Connecion to db failed. Error: ${error}`)
    }
}
