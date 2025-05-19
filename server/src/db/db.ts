import mongoose from "mongoose";

export class DB {
    protected client = mongoose;
    protected mongodbURI: string;

    constructor(mongodbURI: string) {
        this.mongodbURI = mongodbURI;
    }

    public async connectToDB(): Promise<typeof mongoose> {
        try {
            await this.client.connect(this.mongodbURI);
            console.log("Connected to MongoDB");
            return this.client;
        } catch (e) {
            console.error("Failed to connect to MongoDB : ", e);
            process.exit(1);
        }
    }
}
