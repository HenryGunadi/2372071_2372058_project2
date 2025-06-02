import { Document, Query, UpdateWriteOpResult } from "mongoose";
import { IAdminService, Result } from "../types/types";
import User, { IUser } from "../models/user";
import { ThrowError } from "../middleware/throwError";

class AdminService implements IAdminService {
    public async findStaff(email: string): Promise<Result<IUser>> {
        try {
            const user = await User.findOne({ email: email });
            return user;
        } catch (err) {
            console.error("Error finding staff : ", err);
            throw new ThrowError("Failed to retrieve staff information detail", 500, { error: err });
        }
    }

    public async getAllStaff(): Promise<Result<IUser>> {
        try {
            const staff = await User.find({ role: { $in: ["admin", "finance", "committee"] } });
            return staff;
        } catch (err) {
            console.error("Error getting all staff : ", err);
            throw new ThrowError("Failed to retrieve staff information", 500, { error: err });
        }
    }

    public async updateStaff(email: string, value: Partial<IUser>): Promise<void> {
        try {
            if (!value.password) {
                delete value.password;
            }

            const result = await User.updateOne({ email: email }, { $set: value });

            if (!result.acknowledged) {
                throw new ThrowError("Update operation was not acknowledged.", 500);
            }

            if (result.matchedCount === 0) {
                throw new ThrowError("No staff found with that email.", 400, { error: "User Email not found" });
            }

            if (result.modifiedCount === 0) {
                console.log("No changes were made to the staff.");
                throw new ThrowError("Error updating staff", 500, { error: "Something went wrong" });
            } else {
                console.log("Staff updated successfully.");
            }
        } catch (err) {
            console.error("Error updating staff : ", err);
            throw new ThrowError("Failed to update staff", 500, { error: err });
        }
    }

    public async deleteStaff(email: string): Promise<Result> {
        try {
            const result = await User.deleteOne({ email: email });

            if (!result.acknowledged) {
                throw new ThrowError("Update operation was not acknowledged.", 500);
            }

            if (result.deletedCount === 0) {
                throw new ThrowError("No staff found with that email.", 400, { error: "User Email not found" });
            }
        } catch (err) {
            console.error("Error deleting staff : ", err);
            throw new ThrowError("Failed to delete staff", 500, { error: err });
        }
    }

    public async createStaff(staff: Omit<IUser, keyof Document>): Promise<Result> {
        try {
            const user = await User.create(staff);

            await user.save();
        } catch (err) {
            console.error("Error adding staff : ", err);
            throw new ThrowError("Failed to add staff", 500, { error: err });
        }
    }
}

export default AdminService;
