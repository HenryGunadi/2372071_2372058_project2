import { AuthController } from "../controllers/auth";
import { DB } from "../db/db";
import express, {NextFunction, Request, Response, Router} from "express"

const authRouter = () => {
    const router = express.Router()

    const authController = new AuthController()
    router.post("/login", (req: Request, res: Response, next: NextFunction) =>{
        authController.login(req, res)
    })
    router.post("/register", (req: Request, res: Response, next: NextFunction) =>{
        authController.register(req, res)
    })
    return router
}

export default authRouter