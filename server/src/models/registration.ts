import mongoose, { Schema, Document, Model } from "mongoose";

type Status = "pending" | "paid" | "rejected";

export interface IRegistration extends Document {
    status: Status;
    proof_of_payment: string;
    absence: boolean;
    qr_code: string | null;
    qr_secret: string | null;
    email: string;
    event_id: string;
    created_at: Date;
    updated_at: Date;
}

const RegistrationSchema: Schema<IRegistration> = new Schema({
    status: { type: String, enum: ["pending", "paid", "rejected"], required: true },
    proof_of_payment: { type: String, required: false },
    absence: { type: Boolean, required: true },
    qr_code: { type: String, required: false },
    qr_secret: { type: String, required: false },
    email: { type: String, required: true },
    event_id: { type: String, required: true },
    created_at: { type: Date, required: true },
    updated_at: { type: Date, required: true },
});

const Registration: Model<IRegistration> = mongoose.model<IRegistration>("Registration", RegistrationSchema);

export default Registration;
