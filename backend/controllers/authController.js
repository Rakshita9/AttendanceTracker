import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import User from "../models/User.js";

const createMailer = () => {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        return null;
    }

    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: String(process.env.SMTP_SECURE || "false") === "true",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
};

const sendWelcomeEmail = async (email) => {
    const transporter = createMailer();

    if (!transporter) {
        console.log("SMTP config missing. Skipping welcome email for:", email);
        return;
    }

    await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: email,
        subject: process.env.WELCOME_EMAIL_SUBJECT || "Welcome to Self Attendance Tracker ✨",
        text: "Hi there! Welcome to Self Attendance Tracker. We are happy to have you. Your attendance journey starts now.",
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #2b2b2b;">
                <h2 style="color:#ff4d79; margin-bottom:8px;">Welcome to Self Attendance Tracker ✨</h2>
                <p>Hi there,</p>
                <p>🎉Yay! Your account is ready. We are so happy to have you here.</p>
                <p>Start adding your subjects and track attendance with ease.</p>
                <p style="margin-top:16px;">With love,<br/>Self Attendance Tracker Team</p>
            </div>
        `,
    });
};

export const signup = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const cleanedEmail = email.toLowerCase().trim();
        const existingUser = await User.findOne({ email: cleanedEmail });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            email: cleanedEmail,
            password: hashedPassword,
        });

        await newUser.save();

        try {
            await sendWelcomeEmail(cleanedEmail);
        } catch (mailError) {
            console.log("Welcome email send failed:", mailError.message);
        }

        res.json({ message: "Signup successful 🎉" });
    } catch (error) {
        res.status(500).json({ message: "Signup error", error: error.message });
    }
};

export const getSignupProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user data", error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const cleanedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: cleanedEmail });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        res.json({ message: "Login successful 🎉", token, email: user.email });
    } catch (error) {
        res.status(500).json({ message: "Login error", error: error.message });
    }
};

export const getLoginProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching credentials", error: error.message });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const cleanedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: cleanedEmail });

        // Respond generically to avoid email enumeration.
        if (!user) {
            return res.json({ message: "If an account exists, a reset link has been sent to your email." });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
        await user.save();

        const requestOrigin = req.headers.origin;
        const frontendBaseUrl = process.env.FRONTEND_URL || requestOrigin || "http://localhost:3000";
        const resetUrl = `${frontendBaseUrl.replace(/\/$/, "")}/reset-password?token=${resetToken}`;
        let emailSent = false;

        const transporter = createMailer();

        if (transporter) {

            try {
                await transporter.sendMail({
                    from: process.env.SMTP_FROM || process.env.SMTP_USER,
                    to: cleanedEmail,
                    subject: "Reset your password",
                    text: `Reset your password using this link: ${resetUrl}. This link expires in 15 minutes.`,
                    html: `<p>Click the link below to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>This link expires in 15 minutes.</p>`,
                });
                emailSent = true;
            } catch (mailError) {
                console.log("Failed to send reset email:", mailError.message);
            }
        } else {
            console.log("SMTP config missing. Password reset link:", resetUrl);
        }

        return res.json({ message: "If an account exists, a reset link has been sent to your email." });
    } catch (error) {
        return res.status(500).json({ message: "Could not process forgot password request", error: error.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ message: "Token and new password are required" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters " });
        }

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: new Date() },
        });

        if (!user) {
            return res.status(400).json({ message: "Reset link is invalid or expired" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        return res.json({ message: "Password reset successful" });
    } catch (error) {
        return res.status(500).json({ message: "Could not reset password", error: error.message });
    }
};
