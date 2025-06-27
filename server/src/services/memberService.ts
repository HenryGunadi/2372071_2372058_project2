import { Document, Query, UpdateWriteOpResult } from "mongoose";
import { IAdminService, IMemberService, RegisterEventPayload, RegistrationPayload, Result } from "../types/types";
import User, { IUser } from "../models/user";
import { ThrowError } from "../middleware/throwError";
import Registration, { IRegistration } from "../models/registration";
import Event, { IEvent } from "../models/event";
import Certificate from "../models/certificate";

class MemberService implements IMemberService {
    public async viewMember(email: string): Promise<Result<IUser>> {
        try {
            const user = await User.findOne({ email: email });
            return user;
        } catch (err) {
            console.error("Error finding staff : ", err);
            throw new ThrowError("Failed to retrieve staff information detail", 500, { error: err });
        }
    }

    public async viewRegistrations(email: string): Promise<Result<{ registrations: IRegistration[] | null; events: IEvent[] | null }>> {
        try {
            const registrations = await Registration.find({ email: email });
            let events: IEvent[] = [];
            for (const regist of registrations) {
                const event = await Event.findOne({ _id: regist?.event_id });

                if (!event) {
                    continue;
                }

                events.push(event);
            }

            const response = {
                registrations: registrations,
                events: events,
            };

            return response;
        } catch (err) {
            console.error("Error finding staff : ", err);
            throw new ThrowError("Failed to retrieve staff information detail", 500, { error: err });
        }
    }

    public async registerEvent(registration: RegistrationPayload): Promise<Result> {
        try {
            const user = await Registration.create(registration);
            await user.save();
        } catch (err) {
            console.error("Error adding staff : ", err);
            throw new ThrowError("Failed to add staff", 500, { error: err });
        }
    }

    public async viewCertificates(email: string): Promise<Result> {
        try {
            const certificates = await Certificate.find({email: email});
            return certificates;
        } catch (err) {
            console.error("Error adding staff : ", err);
            throw new ThrowError("Failed to add staff", 500, { error: err });
        }
    }
}

export default MemberService;
