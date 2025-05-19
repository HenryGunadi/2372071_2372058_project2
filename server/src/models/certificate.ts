import mongoose, { Schema, Document, Model } from "mongoose";

interface ICertificate extends Document {
    file_uri: string;
    user_id: string;
    created_at: Date;
    updated_at: Date;
}

const CertificateSchema: Schema<ICertificate> = new Schema({
    file_uri: { type: String, required: true },
    user_id: { type: String, required: true },
    created_at: { type: Date, required: true },
    updated_at: { type: Date, required: true },
});

const Certificate: Model<ICertificate> = mongoose.model("Certificate", CertificateSchema);

export default Certificate;
