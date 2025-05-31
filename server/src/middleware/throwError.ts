import { Response } from "express";

export class ThrowError extends Error {
    public statusCode: number;
    public data: object;

    constructor(msg: string = "Something went wrong", statusCode: number = 400, data: object = {}) {
        super(msg);
        this.statusCode = statusCode;
        this.data = data;
    }
}
