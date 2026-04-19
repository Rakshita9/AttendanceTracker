import Subject from "../models/Subject.js";
import Attendance from "../models/Attendance.js";

export const addSubject = async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: "Subject name is required" });
    }

    try {
        const existingSubject = await Subject.findOne({ name, userId: req.user.id });

        if (existingSubject) {
            return res.status(400).json({ message: "Subject already exists" });
        }

        const newSubject = new Subject({ name, userId: req.user.id });
        await newSubject.save();
        res.status(201).json({ message: "Subject added successfully", subject: newSubject });
    } catch (error) {
        res.status(500).json({ message: "Error saving subject", error: error.message });
    }
};

export const getSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find({ userId: req.user.id });
        res.json(subjects);
    } catch (error) {
        res.status(500).json({ message: "Error fetching subjects", error: error.message });
    }
};

export const deleteSubject = async (req, res) => {
    try {
        await Subject.deleteOne({ name: req.params.name, userId: req.user.id });
        await Attendance.deleteMany({ subject: req.params.name, userId: req.user.id });
        res.json({ message: "Subject and related attendance deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting subject", error: error.message });
    }
};
