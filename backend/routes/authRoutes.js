import express from "express";
import authenticate from "../middleware/authenticate.js";
import {
    signup,
    getSignupProfile,
    login,
    getLoginProfile,
    forgotPassword,
    resetPassword,
} from "../controllers/authController.js";
import { getStats } from "../controllers/statsController.js";

const router = express.Router();

router.post("/signup", signup);
router.get("/signup", authenticate, getSignupProfile);

router.post("/login", login);
router.get("/login", authenticate, getLoginProfile);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/stats", authenticate, getStats);

export default router;