import { Request, Response, NextFunction } from "express";
import Registration from "../models/registration";

export class AttendanceController {
    public async scanQRCode(req: Request, res: Response, next: NextFunction) {
        try {
            const { qr_code } = req.body;

            if (!qr_code) {
                return res.status(400).json({ success: false, message: "QR code tidak dikirim" });
            }

            const registration = await Registration.findOne({ qr_code });

            if (!registration) {
                return res.status(404).json({ success: false, message: "QR code tidak valid" });
            }

            if (registration.status !== "paid") {
                return res.status(400).json({ success: false, message: "Peserta belum membayar" });
            }

            if (registration.absence === true) {
                return res.status(400).json({ success: false, message: "Peserta sudah check-in sebelumnya" });
            }

            registration.absence = true;
            registration.updated_at = new Date();
            await registration.save();

            return res.json({
                success: true,
                data: {
                    email: registration.email,
                    event_id: registration.event_id,
                },
                message: "Check-in berhasil",
            });
        } catch (err) {
            console.error("Scan QR error:", err);
            return res.status(500).json({ success: false, message: "Server error" });
        }
    }
}
