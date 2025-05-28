import { DB } from "../db/db";
import express, { Express } from "express";
import cookieParser from "cookie-parser";
import authRouter from "../routes/auth";
import path from "path";
import { eventRouter } from "../routes/eventRoute";
import { dashboardRouter } from "../routes/dashboardRoute";
import { staffRouter } from "../routes/staffRoute";

const publicPath = path.join(__dirname, "..", "..", "..", "client", "public");
const indexPath = path.join(publicPath, "dashboard.html");
const loginPath = path.join(publicPath, "login.html");

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
        this.apiServer.use("/api/staff", staffRouter());
        
        // 3. Static files middleware
        this.apiServer.use(express.static(publicPath));

        this.apiServer.get("/login", (req, res) => {
        res.sendFile(loginPath);
        });

        // 4. Frontend catch-all (for SPA)
        this.apiServer.get(/(.*)/, (req, res) => {
        res.sendFile(indexPath);
        });
        
        // start server
        this.apiServer
            .listen(this.port, () => console.log("Server is listening on PORT : ", this.port))
            .on("error", (err: any) => {
                console.error("Server failed to start: ", err);
            });
    }
}