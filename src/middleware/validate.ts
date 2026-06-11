import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";


export function validate<T>(schema: ZodSchema<T>) {
    return (req: Request, res: Response, next: NextFunction): void => { 
        const result = schema.safeParse(req.body);
        if(!result.success){
            res.status(400).json({errors: result.error.flatten()});
            return;
        }
        req.body = result.data;
        next();
    }
}