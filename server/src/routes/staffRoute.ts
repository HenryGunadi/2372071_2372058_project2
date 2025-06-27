import express, { NextFunction, Request, Response, Router } from "express";
import { authMiddleware, roleMiddleware } from "../middleware/authMiddleware";
import { AuthRequest } from "../types/types";
import { StaffController } from "../controllers/staffController";
import { EventService } from "../services/eventService";
import multer from "multer";
import { upload } from "../utils/multer";
import { RegistrationService } from "../services/registrationService";
import CertifService from "../services/certifService";

export const staffRouter = () => {
    const router = express.Router();
    const eventService = new EventService();
    const registrationService = new RegistrationService();
    const certifService = new CertifService();
    const staffController = new StaffController(eventService, registrationService, certifService);

    router.post("/createEvent", authMiddleware, roleMiddleware(["committee"]), upload.single("poster"), staffController.createEvent);
    router.patch("/updateEvent", authMiddleware, roleMiddleware(["committee"]), staffController.updateEvent);
    router.delete("/deleteEvent", authMiddleware, roleMiddleware(["committee"]), staffController.deleteEvent);
    router.get("/viewEvents", staffController.getAllEvent);
    router.get("/findEvent", authMiddleware, roleMiddleware(["committee"]), staffController.findEvent);
    router.get("/event/:id", staffController.findEvent);
    router.get("/findRegistration", authMiddleware, roleMiddleware(["finance"]), staffController.findRegistration);
    router.get("/viewFinance", authMiddleware, roleMiddleware(["finance"]), staffController.viewFinance);
    router.patch("/updateRegistration", authMiddleware, roleMiddleware(["finance"]), staffController.updateRegistration);
    router.delete("/deleteRegistration", authMiddleware, roleMiddleware(["finance"]), staffController.deleteRegistration);
    router.post("/attendance", authMiddleware, roleMiddleware(["committee"]), staffController.scan);
    router.get("/viewRegistrationScan", authMiddleware, roleMiddleware(["committee"]), staffController.getAllRegistration);
    router.post("/createCertificate", authMiddleware, roleMiddleware(['committee']), upload.single('certificate'),staffController.createCertificate)
    return router;
};