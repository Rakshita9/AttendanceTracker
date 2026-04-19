import express from "express";
import authenticate from "../middleware/authenticate.js";
import {
    saveAttendance,
    getAttendance,
    deleteAttendance,
} from "../controllers/attendanceController.js";

const router = express.Router();

router.post("/attendance", authenticate, saveAttendance);
router.get("/attendance", authenticate, getAttendance);
router.delete("/attendance", authenticate, deleteAttendance);

export default router;