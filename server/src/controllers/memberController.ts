import { Request, Response, NextFunction } from "express";
import { sendErrorResponse, sendSuccessResponse } from "../utils/utils";
import { createStaffSchema, findOrDeleteStaffSchema, registerEventSchema, updateStaffSchema } from "../validators/validators";
import AdminService from "../services/adminService";
import bycrypt from "bcrypt";
import MemberService from "../services/memberService";
import { IRegistration } from "../models/registration";
import { RegistrationPayload } from "../types/types";

export class MemberController {
    protected service: MemberService;

    constructor(service: MemberService) {
        this.service = service;
    }

    public viewMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const email = req.query.email as string;
            const member = await this.service.viewMember(email);
            console.log("Member : ", member);
            sendSuccessResponse(res, member);
        } catch (err) {
            console.error("Error getting member in member controller : ", err);
            sendErrorResponse(res, err);
        }
    };

    public viewRegistrations = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const email = req.query.email as string;

            const result = await this.service.viewRegistrations(email);
            console.log("View Registrations : ", result);
            sendSuccessResponse(res, result);
        } catch (err) {
            console.error("Error getting member in member controller : ", err);
            sendErrorResponse(res, err);
        }
    };

    public registerEvent = async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log("Register Event Payload : ", req.body);
            const payload = registerEventSchema.parse(req.body);
            const proofOfPaymentURI = req.file?.filename ?? "";

            const registerEvent: RegistrationPayload = {
                status: "pending",
                proof_of_payment: proofOfPaymentURI,
                created_at: new Date(),
                updated_at: new Date(),
                email: payload.email,
                absence: true,
                qr_code: null,
                event_id: payload.event_id,
            };

            await this.service.registerEvent(registerEvent);
            sendSuccessResponse(res);
        } catch (err) {
            console.error("Error getting staff in staff controller : ", err);
            sendErrorResponse(res, err);
        }
    };
    public viewcertificates = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const email = req.query.email as string;
            const result = await this.service.viewCertificates(email);
            console.log("View Certificates : ", result);
            sendSuccessResponse(res, result);
        } catch (err) {
            console.error("Error getting member in member controller : ", err);
            sendErrorResponse(res, err);
        }
    };

}
