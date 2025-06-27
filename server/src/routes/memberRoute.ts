import express, { NextFunction, Request, Response, Router } from "express";
import { authMiddleware, roleMiddleware } from "../middleware/authMiddleware";
import { AuthRequest } from "../types/types";
import { AdminController } from "../controllers/adminController";
import StaffService from "../services/adminService";
import AdminService from "../services/adminService";
import { upload } from "../utils/multer";
import MemberService from "../services/memberService";
import { MemberController } from "../controllers/memberController";

export const memberRouter = () => {
    const router = express.Router();

    const memberService = new MemberService();
    const memberController = new MemberController(memberService);

    router.get("/viewMember", authMiddleware, roleMiddleware(["member"]), memberController.viewMember);
    router.post("/registerEvent", authMiddleware, roleMiddleware(["member"]), upload.single("proof_of_payment"), memberController.registerEvent);
    router.get("/registrations", authMiddleware, memberController.viewRegistrations);
    router.get("/viewCertificates", authMiddleware, roleMiddleware(["member"]), memberController.viewcertificates)

    return router;
};

export default memberRouter;
