import express from "express";
import { getActiveDivisions, getPendingEnrollments, registerStudent, loginStudent } from "../controllers/studentController.js";

const router = express.Router();

router.get("/divisions", getActiveDivisions);
router.get("/pending-enrollments", getPendingEnrollments);
router.post("/register", registerStudent);
router.post("/login", loginStudent);

export default router;


