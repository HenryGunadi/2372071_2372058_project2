import { Document } from "mongoose";
import { ThrowError } from "../middleware/throwError";
import Event, { IEvent } from "../models/event";
import { IRegistrationService, Result } from "../types/types";
import Registration, { IRegistration } from "../models/registration";
import { sendSuccessResponse } from "../utils/utils";
import QRCode from "qrcode";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs/promises";

export class RegistrationService implements IRegistrationService {
    public async findRegistration(id: string): Promise<Result<IRegistration>> {
        try {
            const event = await Registration.findById(id);

            if (!event) {
                throw new ThrowError("Event not found", 400);
            }

            return event;
        } catch (err) {
            console.error("Error finding event : ", err);
            throw new ThrowError("Failed to find registration", 500, { error: err });
        }
    }

    public async getAllRegistrations(): Promise<IRegistration[]> {
        try {
            const registrations = await Registration.find().lean<IRegistration[]>();
            return registrations;
        } catch (err) {
            console.error("Error getting registrations: ", err);
            throw new ThrowError("Failed to get registrations", 500, { error: err });
        }
    }

    public async updateRegistration(id: string, value: Partial<IRegistration>): Promise<Result> {
        try {
            const reg = await Registration.findById(id);
            if (!reg) throw new ThrowError("Registration not found", 404);

            reg.set(value);
            reg.updated_at = new Date();

            if (value.status === "paid" && !reg.qr_code) {
                const secret = uuidv4();
                const ticket = JSON.stringify({ r: reg._id, e: reg.event_id, s: secret });

                const dir = path.join(__dirname, "../uploads/qrcodes");
                await fs.mkdir(dir, { recursive: true });

                const fileName = `${reg._id}.png`;
                await QRCode.toFile(path.join(dir, fileName), ticket, { width: 300 });

                reg.qr_code = `qrcodes/${fileName}`;
                reg.qr_secret = secret;
            }

            await reg.save();
            return { success: true, data: reg.toObject() } as Result; // conforms to type
        } catch (err) {
            console.error("Error updating registration:", err);
            throw new ThrowError("Failed to update registration", 500, { error: err });
        }
    }

    public async deleteRegistration(id: string): Promise<Result> {
        try {
            const result = await Registration.deleteOne({ _id: id });

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
}
