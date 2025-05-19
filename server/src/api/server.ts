import { DB } from "../db/db";
import express, { Express } from "express";
import cookieParser from "cookie-parser";

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

        // start server
        this.apiServer
            .listen(this.port, () => console.log("Server is listening on PORT : ", this.port))
            .on("error", (err: any) => {
                console.error("Server failed to start: ", err);
            });
    }
}
