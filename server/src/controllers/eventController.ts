import express, { Request, Response, NextFunction } from "express";
import { EventService } from "../services/eventService";
import { sendErrorResponse, sendSuccessResponse } from "../utils/utils";
import { createEventSchema, findOrDeleteSchema, updateEventSchema } from "../validators/validators";

export class EventController {
    protected service: EventService;

    constructor(service: EventService) {
        this.service = service;
    }

    public findEvent = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const payload = findOrDeleteSchema.parse({ id: req.params.id });
            const event = await this.service.findEvent(payload.id);

            sendSuccessResponse(res, event);
        } catch (err) {
            console.error("Find event controller error : ", err);
            sendErrorResponse(res, err);
        }
    };

    public getAllEvent = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const events = await this.service.getAllEvent();
            sendSuccessResponse(res, events);
        } catch (err) {
            console.error("Find event controller error : ", err);
            sendErrorResponse(res, err);
        }
    };

    public updateEvent = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const payload = updateEventSchema.parse(req.body);
            await this.service.updateEvent(payload.id, payload.value);
        } catch (err) {
            console.error("Find event controller error : ", err);
            sendErrorResponse(res, err);
        }
    };

    public deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const payload = findOrDeleteSchema.parse({ id: req.params.id });
            await this.service.deleteEvent(payload.id);
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
                event_days: fixedEventDays,
                poster_uri: posterUri,
                created_at: new Date(),
                updated_at: new Date(),
                status: true,
            };

            await this.service.createEvent(event);
            console.log("Event has been created");
            sendSuccessResponse(res);
        } catch (err) {
            console.error("Create event controller error : ", err);
            sendErrorResponse(res, err);
        }
    };

    public registerEvent(req: Request, res: Response, next: NextFunction) {
        return res.status(200).json({ message: "Event Register" });
    }
}
