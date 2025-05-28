import express, {NextFunction, Request, Response, Router} from "express"
import { authMiddleware } from "../middleware/authMiddleware"
import { AuthRequest } from "../types/types"
import { EventController } from "../controllers/eventController"

export const eventRouter = () => {
    const router = express.Router()

    const eventController = new EventController()
    router.post('/register', authMiddleware, (req: AuthRequest, res:Response, next:NextFunction) => {
        eventController.registerEvent(req, res, next)
    })
    return router
}