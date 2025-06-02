import { Document } from "mongoose";
import { ThrowError } from "../middleware/throwError";
import Event, { IEvent } from "../models/event";
import { IEventService, Result } from "../types/types";

export class EventService implements IEventService {
    public async findEvent(id: string): Promise<Result<IEvent>> {
        try {
            const event = await Event.findById(id);

            if (!event) {
                throw new ThrowError("Event not found", 400);
            }

            return event;
        } catch (err) {
            console.error("Error finding event : ", err);
            throw new ThrowError("Failed to find event", 500, { error: err });
        }
    }

    public async getAllEvent(): Promise<Result<IEvent>> {
        try {
            const events = await Event.find();
            return events;
        } catch (err) {
            console.error("Error getting events: ", err);
            throw new ThrowError("Failed to get events", 500, { error: err });
        }
    }

    public async updateEvent(id: string, value: Partial<IEvent>): Promise<Result> {
        try {
            const result = await Event.updateOne({ _id: id }, { $set: value });

            if (!result.acknowledged) {
                throw new ThrowError("Update operation was not acknowledged.", 500);
            }

            if (result.matchedCount === 0) {
                throw new ThrowError("No event found with id.", 400, { error: "Event not found" });
            }

            if (result.modifiedCount === 0) {
                console.log("No changes were made to the staff.");
                throw new ThrowError("Error updating event", 500, { error: "Something went wrong" });
            } else {
                console.log("Staff updated successfully.");
            }
        } catch (err) {
            console.error("Error updating events: ", err);
            throw new ThrowError("Failed to update event", 500, { error: err });
        }
    }

    public async deleteEvent(id: string): Promise<Result> {
        try {
            const result = await Event.deleteOne({ _id: id });

            if (!result.acknowledged) {
                throw new ThrowError("Update operation was not acknowledged.", 500);
            }

            if (result.deletedCount === 0) {
                throw new ThrowError("Something went wrong or event not founds", 500, { error: "Something went wrong" });
            }
        } catch (err) {
            console.error("Error deleting event: ", err);
            throw new ThrowError("Failed to delete event", 500, { error: err });
        }
    }

    public async createEvent(event: Omit<IEvent, keyof Document>): Promise<Result> {
        try {
            const result = await Event.create(event);

            await result.save();
        } catch (err) {
            console.error("Error creating event: ", err);
            throw new ThrowError("Failed to create event", 500, { error: err });
        }
    }

    public async markExpiredEvents(): Promise<Result> {
        try {
            // await Event.updateMany({})
        } catch (err) {
            console.error("Error closing event : ", err);
            throw new ThrowError("Failed to close event : ", 500, { error: err });
        }
    }
}
