import cron from "node-cron";
import { EventService } from "../services/eventService";

const eventService = new EventService();

export const startDailyEventExpirationCheck = () => {
    // Runs every day at 00:00 (midnight)
    cron.schedule("0 0 * * *", async () => {
        console.log("Running daily event expiration check...");

        try {
            const now = new Date();
            // await eventService.markExpiredEvents(now);
            console.log("Expired events updated.");
        } catch (err) {
            console.error("Error checking expired events:", err);
        }
    });
};
