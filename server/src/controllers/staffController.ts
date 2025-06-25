import express, { Request, Response, NextFunction } from "express";
import { EventService } from "../services/eventService";
import { sendErrorResponse, sendSuccessResponse } from "../utils/utils";
import { createEventSchema, findOrDeleteSchema, registerEventSchema, updateEventSchema, updateRegistrationSchema } from "../validators/validators";
import { RegistrationService } from "../services/registrationService";
import { IEvent } from "../models/event";
import { IRegistration } from "../models/registration";
import QRCode from "qrcode";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs/promises";

export class StaffController {
    protected eventService: EventService;
    protected registrationService: RegistrationService;

    constructor(eventService: EventService, registrationService: RegistrationService) {
        this.eventService = eventService;
        this.registrationService = registrationService;
    }

    public findEvent = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const payload = findOrDeleteSchema.parse({ id: req.params.id });
            const event = await this.eventService.findEvent(payload.id);

            sendSuccessResponse(res, event);
        } catch (err) {
            console.error("Find event controller error : ", err);
            sendErrorResponse(res, err);
        }
    };

    public getAllEvent = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const events = await this.eventService.getAllEvent();
            sendSuccessResponse(res, events);
        } catch (err) {
            console.error("Find event controller error : ", err);
            sendErrorResponse(res, err);
        }
    };

    public updateEvent = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const payload = updateEventSchema.parse(req.body);
            await this.eventService.updateEvent(payload.id, payload.value);
        } catch (err) {
            console.error("Find event controller error : ", err);
            sendErrorResponse(res, err);
        }
    };

    public deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const payload = findOrDeleteSchema.parse({ id: req.params.id });
            await this.eventService.deleteEvent(payload.id);
            sendSuccessResponse(res, undefined, "The event has been deleted successfully.");
        } catch (err) {
            console.error("Find event controller error : ", err);
            sendErrorResponse(res, err);
        }
    };

    public createEvent = async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log("Create event payload : ", req.body);
            console.log(typeof req.body.max_participants);

            const posterUri = req.file?.filename ?? "";

            // Validate and parse input
            const parsed = createEventSchema.parse(req.body);

            // Helper function to combine date and time strings into a Date object
            const combineDateAndTime = (date: Date, timeStr: string): Date => {
                const [hours, minutes] = timeStr.split(":").map(Number);
                return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes);
            };

            // Convert event_days start_time and end_time from string to Date
            const fixedEventDays = parsed.event_days.map((ed) => ({
                ...ed,
                start_time: combineDateAndTime(ed.date, ed.start_time),
                end_time: combineDateAndTime(ed.date, ed.end_time),
            }));

            // Construct the event object
            const event = {
                ...parsed,
                deskripsi: parsed.deskripsi,
                event_days: fixedEventDays,
                poster_uri: posterUri,
                max_participants: Number(parsed.max_participants),
                total_registered: 0,
                created_at: new Date(),
                updated_at: new Date(),
                status: true,
            };

            await this.eventService.createEvent(event);
            console.log("Event has been created");
            sendSuccessResponse(res);
        } catch (err) {
            console.error("Create event controller error : ", err);
            sendErrorResponse(res, err);
        }
    };

    public findRegistration = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const registrationId = req.query.registrationId as string;
            const registration = await this.registrationService.findRegistration(registrationId);

            sendSuccessResponse(res, registration);
        } catch (err) {
            console.error("Find registration controller error : ", err);
            sendErrorResponse(res, err);
        }
    };

    public viewFinance = async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log("IM HERE");
            const registrations: IRegistration[] = await this.registrationService.getAllRegistrations();
            const registrationsWithEvent = await Promise.all(
                registrations.map(async (reg) => {
                    const event = await this.eventService.findEvent(reg.event_id);
                    return { ...reg, event };
                })
            );

            sendSuccessResponse(res, registrationsWithEvent);
        } catch (err) {
            console.error("Get all registrations controller error : ", err);
            sendErrorResponse(res, err);
        }
    };

    public deleteRegistration = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const registrationId = req.query.registrationId as string;
            const registration = await this.registrationService.deleteRegistration(registrationId);

            sendSuccessResponse(res, undefined, "The registration has been deleted successfully.");
        } catch (err) {
            console.error("Delete registration controller error : ", err);
            sendErrorResponse(res, err);
        }
    };

    public updateRegistration = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const payload = updateRegistrationSchema.parse(req.body);
            await this.registrationService.updateRegistration(payload.registration_id, payload.value);

            sendSuccessResponse(res, undefined, "The registration has been updated.");
        } catch (err) {
            console.error("Find event controller error : ", err);
            sendErrorResponse(res, err);
        }
    };
}
