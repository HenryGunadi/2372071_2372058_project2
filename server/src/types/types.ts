import { promises } from "dns";
import { Document } from "mongoose";
import { Request } from "express";
import { IUser } from "../models/user";
import { ThrowError } from "../middleware/throwError";
import { IEvent } from "../models/event";

export type Result<T = any> = T | null | T[] | undefined | void;

export type Config = {
    port: number;
    mongodbURI: string;
};

export type findStaff = {};

export interface IUserService {
    getAllUser(): Promise<Document[]>;
    findUser(email: string): Promise<Document>;
}

export interface AuthRequest extends Request {
    user?: {
        userId: string;
        role: string;
    };
}

export interface IAdminService {
    findStaff(email: string): Promise<Result<IUser>>;
    getAllStaff(): Promise<Result<IUser>>;
    updateStaff(email: string, value: IUser): Promise<Result>;
    deleteStaff(email: string): Promise<Result>;
    createStaff(staff: Omit<IUser, keyof Document>): Promise<Result>;
}

export interface IEventService {
    findEvent(id: string): Promise<Result<IEvent>>;
    getAllEvent(): Promise<Result<IEvent>>;
    updateEvent(id: string, value: Partial<IEvent>): Promise<Result>;
    deleteEvent(id: string): Promise<Result>;
    createEvent(event: Omit<IEvent, keyof Document>): Promise<Result>;
    markExpiredEvents(): Promise<Result>;
}
