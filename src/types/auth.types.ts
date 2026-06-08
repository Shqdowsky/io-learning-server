import type { JwtPayload } from "jsonwebtoken";
import type { IUserPayload } from "./user.types.js"

export interface ReqBody{
    name: string,
    email: string,
    password: string
}

export interface AuthResult {
    token: string,
    user: IUserPayload
}

export interface AppJwtPayload extends JwtPayload {
  userId: string;
  name: string;
  email: string;
  role: string;
}