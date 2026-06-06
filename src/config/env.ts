import dotenv from "dotenv";
dotenv.config();

function requireEnv(key: string): string {
    const value = process.env[key];
    if (!value) throw new Error(`Missing required env variable: ${key}`);
    return value;
}

export const env = {
    JWT_SECRET: requireEnv("JWT_SECRET"),
    MONGO_URI: requireEnv("MONGODB_URL"),
    PORT: requireEnv("PORT"),
}