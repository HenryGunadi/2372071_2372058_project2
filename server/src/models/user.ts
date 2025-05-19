import mongoose, { Schema, Document, Model } from "mongoose";

type Role = "member" | "admin" | "finance" | "committee";

interface IUser extends Document {
    name: string;
    role: Role;
    email: string;
    password: string;
    created_at: Date;
    updated_at: Date;
}

const UserSchema: Schema<IUser> = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ["member", "admin", "finance", "committee"], required: true },
    password: { type: String, required: true },
    created_at: { type: Date, required: true },
    updated_at: { type: Date, required: true },
});

const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default User;
