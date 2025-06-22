import express, { NextFunction, Request, Response, Router } from "express";
import { authMiddleware, roleMiddleware } from "../middleware/authMiddleware";
import { AuthRequest } from "../types/types";
import { EventController } from "../controllers/eventController";
import { EventService } from "../services/eventService";
import multer from "multer";
import { upload } from "../utils/multer";

export const eventRouter = () => {
    const router = express.Router();
    const eventService = new EventService();
    const eventController = new EventController(eventService);

    router.post("/createEvent", authMiddleware, roleMiddleware(["committee"]), upload.single("poster"), eventController.createEvent);
    router.patch("/updateEvent", authMiddleware, roleMiddleware(["committee"]), eventController.updateEvent);
    router.delete("/deleteEvent", authMiddleware, roleMiddleware(["committee"]), eventController.deleteEvent);
    router.get("/viewEvents", eventController.getAllEvent);
    router.get("/findEvent", authMiddleware, roleMiddleware(["committee"]), eventController.findEvent);
    router.get("/:id", eventController.findEvent);


    return router;
};
