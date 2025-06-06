import { Request, Response, NextFunction } from "express";
import { sendErrorResponse, sendSuccessResponse } from "../utils/utils";
import { createStaffSchema, findOrDeleteStaffSchema, updateStaffSchema } from "../validators/validators";
import AdminService from "../services/adminService";
import bycrypt from "bcrypt";

export class AdminController {
    protected service: AdminService;

    constructor(service: AdminService) {
        this.service = service;
    }

    public ViewAllStaff = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const allStaff = await this.service.getAllStaff();
            console.log("All Staff : ", allStaff);
            sendSuccessResponse(res, allStaff);
        } catch (err) {
            console.error("Error getting staff in staff controller : ", err);
            sendErrorResponse(res, err);
        }
    };

    public findStaff = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // validate payload
            const payload = findOrDeleteStaffSchema.parse({ email: req.params.email });

            const staff = await this.service.findStaff(payload.email);
            sendSuccessResponse(res, staff);
        } catch (err) {
            console.error("Error getting staff in staff controller : ", err);
            sendErrorResponse(res, err);
        }
    };

    public updateStaff = async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log("Update payload : ", req.body);
            const payload = updateStaffSchema.parse(req.body);

            await this.service.updateStaff(payload.email, payload.value);

            sendSuccessResponse(res);
        } catch (err) {
            console.error("Error getting staff in staff controller : ", err);
            sendErrorResponse(res, err);
        }
    };

    public deleteStaff = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const payload = findOrDeleteStaffSchema.parse({ email: req.params.email });
            await this.service.deleteStaff(payload.email);

            sendSuccessResponse(res);
        } catch (err) {
            console.error("Error getting staff in staff controller : ", err);
            sendErrorResponse(res, err);
        }
    };

    public createStaff = async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log("Create Staff Payload : ", req.body);
            const payload = createStaffSchema.parse(req.body);
            const cost = 10;

            payload.password = await bycrypt.hash(payload.password, cost);
            await this.service.createStaff(payload);
            sendSuccessResponse(res);
        } catch (err) {
            console.error("Error getting staff in staff controller : ", err);
            sendErrorResponse(res, err);
        }
    };

    public getOverview(req: Request, res: Response, next: NextFunction) {
        return res.status(200).json({ message: "Staff" });
    }
}
