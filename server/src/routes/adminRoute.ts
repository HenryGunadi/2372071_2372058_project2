import express, { NextFunction, Request, Response, Router } from "express";
import { authMiddleware, roleMiddleware } from "../middleware/authMiddleware";
import { AuthRequest } from "../types/types";
import { AdminController } from "../controllers/adminController";
import StaffService from "../services/adminService";
import AdminService from "../services/adminService";

export const adminRouter = () => {
    const router = express.Router();

    const adminService = new AdminService();
    const adminController = new AdminController(adminService);

    router.get("/viewAllStaff", authMiddleware, roleMiddleware(["admin"]), adminController.ViewAllStaff);
    router.get("/findStaff/:email", authMiddleware, roleMiddleware(["admin"]), adminController.findStaff);
    router.delete("/deleteStaff/:email", authMiddleware, roleMiddleware(["admin"]), adminController.deleteStaff);
    router.patch("/updateStaff", authMiddleware, roleMiddleware(["admin"]), adminController.updateStaff);
    router.post("/createStaff", authMiddleware, roleMiddleware(["admin"]), adminController.createStaff);

    return router;
};

export default adminRouter;
