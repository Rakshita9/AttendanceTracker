import User from "../models/User.js";
import Subject from "../models/Subject.js";
import Attendance from "../models/Attendance.js";

export const getStats = async (req, res) => {
    try {
        const [totalUsers, totalSubjects, totalAttendanceRecords] = await Promise.all([
            User.countDocuments({}),
            Subject.countDocuments({}),
            Attendance.countDocuments({}),
        ]);

        res.json({
            totalUsers,
            totalSubjects,
            totalAttendanceRecords,
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching stats", error: error.message });
    }
};