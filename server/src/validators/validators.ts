import { z } from "zod";

export const findOrDeleteStaffSchema = z.object({
    email: z.string().email(),
});

const roleEnum = z.enum(["admin", "finance", "committee"]);

const userUpdateValueSchema = z.object({
    name: z.string().optional(),
    role: roleEnum.optional(),
    email: z.string().email().optional(),
    password: z.string().optional(),
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
    password: z.string().min(6, "Password should be at least 6 characters"),
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
