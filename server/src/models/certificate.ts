import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICertificate extends Document {
    file_uri: string;
    email: string;
    registration_id: string;
    created_at: Date;
    updated_at: Date;
}

const CertificateSchema: Schema<ICertificate> = new Schema({
    file_uri: { type: String, required: true },
    email: { type: String, required: true },
    registration_id: {type: String, required: true},
    created_at: { type: Date, required: true },
    updated_at: { type: Date, required: true },
});

const Certificate: Model<ICertificate> = mongoose.model("Certificate", CertificateSchema);

export default Certificate;