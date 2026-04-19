import express from "express";
import authenticate from "../middleware/authenticate.js";
import {
    addSubject,
    getSubjects,
    deleteSubject,
} from "../controllers/subjectController.js";

const router = express.Router();

router.post("/subject", authenticate, addSubject);
router.get("/subject", authenticate, getSubjects);
router.delete("/subjects/:name", authenticate, deleteSubject);

export default router;
