import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { configureDNS } from "./config/dns.js";
import { connectDB } from "./config/db.js";
import { getCorsOptions } from "./config/corsOptions.js";
import requestLogger from "./middleware/requestLogger.js";
import authRoutes from "./routes/authRoutes.js";
import subjectRoutes from "./routes/subjectRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";

dotenv.config();
configureDNS();
connectDB();
const app = express();
app.use(express.json());
app.use(cors(getCorsOptions()));
app.use(requestLogger);

app.use("/", authRoutes);
app.use("/", subjectRoutes);
app.use("/", attendanceRoutes);

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use. Stop the existing backend process or change PORT in .env.`);
        process.exit(1);
    }

    console.error("Server startup error:", error.message);
    process.exit(1);
});
