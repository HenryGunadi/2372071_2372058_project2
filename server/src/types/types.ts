import { promises } from "dns";
import { Document } from "mongoose";
import { Request } from "express";

export type Config = {
    port: number;
    mongodbURI: string;
};

export interface UserServiceInterface {
    getAllUser(): Promise<Document[]> 
    findUser(email: string): Promise<Document> 
};

export interface AuthRequest extends Request {
    user?: {
        userId: string;
        role: string;
    };
}
