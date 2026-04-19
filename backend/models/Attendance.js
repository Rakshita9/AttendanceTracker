import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subject: { type: String, required: true },
    date: { type: String, required: true },
    status: { type: String, enum: ["Present", "Absent", "Holiday"], required: true },
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;
