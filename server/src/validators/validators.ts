import { z } from "zod";

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

export const createEventSchema = z.object({
    title: z.string().min(1),
    time: z.preprocess((arg) => new Date(arg as string), z.date()),
    location: z.string().min(1),
    speaker: z.string().min(1),
    price: z.preprocess((val) => Number(val), z.number().nonnegative()),
    max_participants: z.preprocess((val) => Number(val), z.number().int().positive()),
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
