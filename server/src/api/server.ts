import { DB } from "../db/db";
import express, { Express, Request, Response } from "express";
import cookieParser from "cookie-parser";
import authRouter from "../routes/auth";
import path from "path";
import { eventRouter } from "../routes/eventRoute";
import { dashboardRouter } from "../routes/dashboardRoute";
import adminRouter from "../routes/adminRoute";

const publicPath = path.join(__dirname, "..", "..", "..", "client", "public");
const indexPath = path.join(publicPath, "dashboard.html");
const loginPath = path.join(publicPath, "login.html");

const servePage = (filename: string) => (req: Request, res: Response) => {
    res.sendFile(path.join(publicPath, filename));
};

export class APIServer {
    protected port: number;
    protected apiServer: Express;
    protected DB: DB;

    constructor(port: number, db: DB) {
        this.port = port;
        this.apiServer = express();
        this.DB = db;
    }

    public run(): void {
        // middlewares
        this.apiServer.use(express.json());
        this.apiServer.use(express.urlencoded({ extended: true }));
        this.apiServer.use(cookieParser());

        // routes
        this.apiServer.use("/api/auth", authRouter());
        this.apiServer.use("/api/event", eventRouter());
        this.apiServer.use("/api/dashboard", dashboardRouter());
        this.apiServer.use("/api/admin", adminRouter());
        this.apiServer.use("/api/event", eventRouter());

        // 3. Static files middleware
        this.apiServer.use(express.static(publicPath));
        this.apiServer.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

        this.apiServer.get("/login", servePage("login.html"));
        this.apiServer.get("/register", servePage("register.html"));
        this.apiServer.get("/staffDashboard", servePage("staffDashboard.html"));
        this.apiServer.get("/dashboard", servePage("dashboard.html"));
        this.apiServer.get("/tables", servePage("pages/tables/basic-table.html"));

        this.apiServer.get(/(.*)/, servePage("dashboard.html"));

        // start server
        this.apiServer
            .listen(this.port, () => console.log("Server is listening on PORT : ", this.port))
            .on("error", (err: any) => {
                console.error("Server failed to start: ", err);
            });
    }
}
