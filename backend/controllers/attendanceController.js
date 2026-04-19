import Attendance from "../models/Attendance.js";

export const saveAttendance = async (req, res) => {
    const { subject, date, status } = req.body;

    try {
        const existingAttendance = await Attendance.findOne({
            subject,
            date,
            userId: req.user.id,
        });

        if (existingAttendance) {
            existingAttendance.status = status;
            await existingAttendance.save();
        } else {
            const newAttendance = new Attendance({
                subject,
                date,
                status,
                userId: req.user.id,
            });
            await newAttendance.save();
        }

        res.json({ message: "Attendance saved successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error saving attendance", error: error.message });
    }
};

export const getAttendance = async (req, res) => {
    try {
        const data = await Attendance.find({ userId: req.user.id });
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching attendance", error: error.message });
    }
};

export const deleteAttendance = async (req, res) => {
    const { subject, date } = req.body;

    if (!subject || !date) {
        return res.status(400).json({ message: "Subject and date are required" });
    }

    try {
        await Attendance.deleteOne({ subject, date, userId: req.user.id });
        res.json({ message: "Attendance deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting attendance", error: error.message });
    }
};
