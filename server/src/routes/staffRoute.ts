import express, {NextFunction, Request, Response, Router} from "express"
import { authMiddleware, roleMiddleware } from "../middleware/authMiddleware"
import { AuthRequest } from "../types/types"
import { StaffController } from "../controllers/staffController"

export const staffRouter = () => {
    const router = express.Router()

    const staffController = new StaffController()
    router.get('/view', authMiddleware, roleMiddleware(["admin", "committee", "finance"]),(req: AuthRequest, res:Response, next:NextFunction) => {
        staffController.getOverview(req, res, next)
    })
    return router
}