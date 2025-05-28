import dotenv from "dotenv";
dotenv.config();
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user";

export class AuthController {
    public register = async (req: Request, res: Response) => {
        try {
            const { name, email, password} = req.body;
            console.log('register: ', req.body)

            const existingUser = await User.findOne({ email });
            if (existingUser) return res.status(400).json({ message: "Email already in use"});

            const hashedPassword = await bcrypt.hash(password, 10);
            const now = new Date();

            const user = new User({
                name,
                email,
                role: 'member',
                password: hashedPassword,
                created_at: now,
                updated_at: now,
            });

            await user.save();
            res.status(201).json({ message: "User registered successfully"});
        } catch (err) {
            console.error("Error: ", err)
            res.status(500).json({ message: "Server error", error: err });
        }
    };

    public login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            console.log("loginPayLoad:", req.body);

            const user = await User.findOne({ email });
            if (!user) return res.status(401).json({ message: "Invalid credentials, not found" });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

            // Optional: Validate allowed roles
            const allowedRoles = ["admin", "committee", "finance", "member"];
            if (!allowedRoles.includes(user.role)) {
                return res.status(403).json({ message: "Unauthorized role access" });
            }

            const token = jwt.sign(
                { userId: user._id, role: user.role },
                process.env.JWT_SECRET as string,
                { expiresIn: "1d" }
            );

            // Custom message or data based on role
            let roleMessage = "";
            switch (user.role) {
                case "admin":
                    roleMessage = "Welcome Admin!";
                    break;
                case "committee":
                    roleMessage = "Welcome Committee Member!";
                    break;
                case "finance":
                    roleMessage = "Welcome Finance Team!";
                    break;
                case "member":
                    roleMessage = "Welcome Participant!";
                    break;
                default:
                    roleMessage = "Welcome!";
            }
            console.log("Login Successful")
            return res.status(200).json({
                message: "Login Successful",
                token,
                roleMessage,
                user: {
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            });

        } catch (err) {
            console.error("Error during login: ", err);
            return res.status(500).json({ message: "Server error", error: err });
        }
    };

}

