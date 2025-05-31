import { Response } from "express";
import { ThrowError } from "../middleware/throwError";
import { ZodError } from "zod";
import { measureMemory } from "vm";

export const sendSuccessResponse = (response: Response, data: any = {}, message = "Success", statusCode = 200) => {
    return response.status(statusCode).json({ success: true, message: message, data: data });
};

export const sendErrorResponse = (response: Response, error: unknown) => {
    let statusCode = 400;

    if (error instanceof ThrowError) {
        statusCode = error.statusCode;
        return response.status(statusCode).json({ success: false, message: error.message, data: error.data || {} });
    } else if (error instanceof ZodError) {
        return response.status(400).json({
            success: false,
            message: "Validation failed",
            errors: error.errors,
        });
    }

    return response.status(500).json({ message: "Internal server error" });
};

export const checkUpdate = (): void => {
    return;
};
