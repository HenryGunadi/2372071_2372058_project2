
import express, {NextFunction, Request, Response, Router} from "express"
import { DashboardController } from "../controllers/dashboardController"
import { AuthRequest } from "../types/types"
import { authMiddleware } from "../middleware/authMiddleware"

export const dashboardRouter = () => {
    const router = express.Router()

    const dashboardController = new DashboardController()
    router.get('/view', authMiddleware,(req: AuthRequest, res:Response, next:NextFunction) => {
        dashboardController.getOverview(req, res, next)
    })
    return router
}