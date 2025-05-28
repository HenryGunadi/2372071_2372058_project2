import express, { Request, Response } from "express";
import { Config } from "./types/types";
import { initConfig } from "./config/config";
import { APIServer } from "./api/server";
import { DB } from "./db/db";

const config = initConfig();

async function startServer(): Promise<void> {
    const db = new DB(config.mongodbURI);
    await db.connectToDB();

    const server = new APIServer(config.port, db);
    server.run();
}

startServer();