import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { AuthRequest } from "../types/types";

dotenv.config();

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction):void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "No token provided" });
        return;
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
            userId: string;
            role: string;
        };

        req.user = {
            userId: decoded.userId,
            role: decoded.role,
        };

        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
        console.error("error in auth middleware: ", err)
        return 
    }
};

export const roleMiddleware = (allowedRoles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            res.status(403).json({ message: "Access denied" });
            return
        }
        next();
    };
};