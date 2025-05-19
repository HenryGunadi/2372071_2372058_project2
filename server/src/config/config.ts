import { Config } from "../types/types";
import dotenv from "dotenv";
dotenv.config();

export function initConfig(): Config {
    const mongodbURI: string | undefined = process.env.MONGODB_URI;

    if (!mongodbURI) {
        throw new Error("MONGODB_URI is not defined in the .env file.");
    }

    const config: Config = {
        port: parseInt(process.env.PORT || "8000", 10),
        mongodbURI: mongodbURI,
    };

    return config;
}
