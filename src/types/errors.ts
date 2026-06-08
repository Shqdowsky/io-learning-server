export class AppError extends Error {
    constructor(
        public message: string, 
        public statusCode: number
    ){
        super(message);
        this.name = "AppError";
    }
}

export interface ErrorResponse {
  message: string;
}