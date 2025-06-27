import { z } from "zod";
import Registration from "../models/registration";

export const findOrDeleteStaffSchema = z.object({
    email: z.string().email(),
});

export const findOrDeleteSchema = z.object({
    id: z.string(),
});

const roleEnum = z.enum(["admin", "finance", "committee"]);

const userUpdateValueSchema = z.object({
    name: z.string().optional(),
    role: roleEnum.optional(),
    email: z.string().email().optional(),
    password: z.string().optional() || z.undefined(),
    status: z.boolean(),
    created_at: z.preprocess((arg) => {
        if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
    }, z.date().optional()),
    updated_at: z.preprocess((arg) => {
        if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
    }, z.date().optional()),
});

export const createStaffSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    role: z.enum(["member", "admin", "finance", "committee"]),
    status: z.boolean(),
    password: z.string(),
    created_at: z.preprocess((arg) => {
        if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
    }, z.date()),
    updated_at: z.preprocess((arg) => {
        if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
    }, z.date()),
});

export const updateStaffSchema = z.object({
    email: z.string().email(),
    value: userUpdateValueSchema,
});

const eventDaySchema = z.object({
    date: z.preprocess((arg) => new Date(arg as string), z.date()),
    start_time: z.string().min(1),
    end_time: z.string().min(1),
    location: z.string().min(1),
    speaker: z.string().min(1),
    status: z.boolean(),
});

export const createEventSchema = z.object({
    title: z.string().min(1),
    deskripsi: z.string().min(10),
    time: z.preprocess((arg) => new Date(arg as string), z.date()),
    price: z.preprocess((val) => Number(val), z.number().nonnegative()),
    max_participants: z.preprocess((val) => Number(val), z.number().int().positive()),
    event_days: z.preprocess((val) => {
        if (typeof val === "string") {
            try {
                return JSON.parse(val);
            } catch {
                return [];
            }
        }
        return val;
    }, z.array(eventDaySchema)),
});

export const updateEventSchema = z.object({
    id: z.string().min(1, "Event ID is required"),
    value: z.object({
        title: z.string().min(1, "Title is required").optional(),
        time: z.preprocess((arg) => (typeof arg === "string" || arg instanceof Date ? new Date(arg) : undefined), z.date().optional()),
        location: z.string().min(1, "Location is required").optional(),
        speaker: z.string().min(1, "Speaker is required").optional(),
        poster_uri: z.string().url("Poster URI must be a valid URL").optional(),
        price: z.number().nonnegative("Price must be a non-negative number").optional(),
        max_participants: z.number().int().positive("Max participants must be a positive integer").optional(),
        created_at: z.preprocess((arg) => (typeof arg === "string" || arg instanceof Date ? new Date(arg) : undefined), z.date().optional()),
        updated_at: z.preprocess((arg) => (typeof arg === "string" || arg instanceof Date ? new Date(arg) : undefined), z.date().optional()),
    }),
});

export const registerEventSchema = z.object({
    event_id: z.string().min(1),
    email: z.string().email("Invalid email address"),
});

export const updateRegistrationSchema = z.object({
    registration_id: z.string().min(1, "Registration ID is required"),

    value: z.object({
        status: z.enum(["pending", "paid", "rejected"]).optional(),
        proof_of_payment: z.string().optional(),
        absence: z.boolean().optional(),
        qr_code: z.string().nullable().optional(),
        email: z.string().email("Invalid email address").optional(),
        event_id: z.string().min(1).optional(),
        updated_at: z.preprocess((arg) => (typeof arg === "string" || arg instanceof Date ? new Date(arg) : undefined), z.date().optional()),
    }),
});

export const createCertificateSchema = z.object({
    email: z.string().email("Invalid email address"),
    registration_id: z.string()
});
