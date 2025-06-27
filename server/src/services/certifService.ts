import fs from "fs/promises";
import path from "path";
import Certificate, { ICertificate } from "../models/certificate";
import { ThrowError } from "../middleware/throwError";

class CertifService {
    public async createCertif(email: string, certifUri: string, registration_id: string): Promise<void> {
        const now = new Date();
        const newCert = new Certificate({
            file_uri: certifUri,
            email,
            registration_id: registration_id,
            created_at: now,
            updated_at: now,
        });
        await newCert.save();
        console.log("certif created")
    }

    public async findCertif(certifUri: string): Promise<ICertificate | null> {
        return await Certificate.findOne({ file_uri: certifUri });
    }

    public async deleteCertif(certifUri: string): Promise<void> {
        await Certificate.deleteOne({ file_uri: certifUri });
    }

    public async deleteFile(filePath: string): Promise<void> {
        try {
            await fs.unlink(filePath);
            console.log("🗑️ Deleted file:", filePath);
        } catch (err) {
            console.warn("⚠️ File not found or deletion failed:", filePath);
        }
    }

    public async findCertifByUri(certifUri: string): Promise<ICertificate | null> {
        // Extract registration_id from URI
        const parts = certifUri.split("-certificate-");
        if (parts.length !== 2) return null;

        const registrationIdWithExt = parts[1]; // e.g., 685d57fb82cc733810d9ba80.jpeg
        const registrationId = path.parse(registrationIdWithExt).name; // removes ".jpg"

        // Find certificate using the extracted registration ID
        return await Certificate.findOne({ registration_id: registrationId });
    }

}

export default CertifService;