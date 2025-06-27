import multer from "multer";
import path from "path";
import { Request } from "express";

const uploadDir = path.resolve(__dirname, "../uploads");
const certificateDir = path.resolve(__dirname, "../uploads/certificates");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (req.query.email && req.query.registId) {
            cb(null, certificateDir);
        } else {
            cb(null, uploadDir);
        }
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const now = new Date();
        const formatted = now.toISOString().slice(0,19).replace(/[:T]/g, "-");
        let uniqueName = `${formatted}-${Math.round(Math.random() * 1e9)}${ext}`;
        if (req.query.email && req.query.registId) {
            uniqueName = `${req.query.email}-${formatted}-certificate-${req.query.registId}${ext}`;
        }
        cb(null, uniqueName);
    },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only image or PDF files are allowed"));
    }
};

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
});