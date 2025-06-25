import { promises } from "dns";
import { Document } from "mongoose";
import { Request } from "express";
import { IUser } from "../models/user";
import { ThrowError } from "../middleware/throwError";
import { IEvent } from "../models/event";
import { IRegistration } from "../models/registration";

export type Result<T = any> = T | null | T[] | undefined | void;

export type Config = {
    port: number;
    mongodbURI: string;
};

export type findStaff = {};

export interface RegisterEventPayload {
    email: string;
    proof_of_payment: File;
}

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

export type RegistrationPayload = {
    status: "pending" | "paid" | "rejected";
    proof_of_payment: string;
    absence: boolean;
    qr_code: string | null;
    email: string;
    event_id: string;
    created_at: Date;
    updated_at: Date;
};

export interface UpdateRegistration {
    registration_id: string;
    status: "paid" | "rejected";
}

export interface IAdminService {
    findStaff(email: string): Promise<Result<IUser>>;
    getAllStaff(): Promise<Result<IUser>>;
    updateStaff(email: string, value: IUser): Promise<Result>;
    deleteStaff(email: string): Promise<Result>;
    createStaff(staff: Omit<IUser, keyof Document>): Promise<Result>;
}

export interface IMemberService {
    viewMember(email: string): Promise<Result<IUser>>;
    registerEvent(registration: RegistrationPayload): Promise<Result>;
    viewRegistrations(email: string): Promise<Result>;
}

export interface IEventService {
    findEvent(id: string): Promise<IEvent>;
    getAllEvent(): Promise<Result<IEvent>>;
    updateEvent(id: string, value: Partial<IEvent>): Promise<Result>;
    deleteEvent(id: string): Promise<Result>;
    createEvent(event: Omit<IEvent, keyof Document>): Promise<Result>;
    markExpiredEvents(): Promise<Result>;
}

export interface IRegistrationService {
    findRegistration(id: string): Promise<Result<IRegistration>>;
    getAllRegistrations(): Promise<IRegistration[]>;
    updateRegistration(id: string, value: Partial<IRegistration>): Promise<Result>;
    deleteRegistration(id: string): Promise<Result>;
}
