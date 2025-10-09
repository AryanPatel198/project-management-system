// backend/src/routes/adminRoutes.js
import express from "express";
import {
  loginAdmin,
  registerAdmin,
  forgotPassword,
  resetPassword,
  changePassword,
  getAdminProfile,
  updateAdminProfile,
  getAllGuides,
  createGuide,
  updateGuide,
  updateGuideStatus,
  getActiveGuides,
  getGroupsByYearOrCourse,
  getDivisions,
  getGroupById,
  getGroups,
  getAvailableStudentsForGroup,
  getAvailableStudents,
  getStudentsByGroup,
  getEvaluationParams,
  addEvaluationParam,
  updateEvaluationParam,
  deleteEvaluationParam,
  getProjectEvaluations,
  getProjectEvaluationById,
  updateProjectEvaluation,
  updateGroup,
  deleteGroup,
} from "../../controllers/admin/adminController.js";
import { protectAdmin } from "../../middlewares/authMiddleware.js";

const router = express.Router();

// --- Auth routes ---
router.post("/login", loginAdmin);
router.post("/register", registerAdmin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// --- Protected routes ---
router.use(protectAdmin);

// Admin profile
router.get("/profile", getAdminProfile);
router.put("/profile", updateAdminProfile);
router.post("/change-password", changePassword);

// --- Guide management ---
router.get("/get-all-guides", getAllGuides);
router.post("/add-guide", createGuide);
router.put("/update-guide/:id", updateGuide);
router.patch("/new-guide-status/:id", updateGuideStatus);
router.get("/active-guides", getActiveGuides);

// --- Group management ---
router.get("/get-groups", getGroupsByYearOrCourse);
router.get("/get-divisions", getDivisions);
router.get("/get-group/:id", getGroupById);
router.put("/update-group/:id", updateGroup);
router.delete("/delete-group/:id", deleteGroup);
router.get("/get-available-students", getAvailableStudents);
router.get("/get-students-by-group/:id", getStudentsByGroup);
router.get("/groups/:id/students/available", getAvailableStudentsForGroup);

// --- Evaluation parameter management ---
router.get("/get-evaluation-params", getEvaluationParams);
router.post("/add-evaluation-param", addEvaluationParam);
router.put("/update-evaluation-param/:id", updateEvaluationParam);
router.delete("/delete-evaluation-param/:id", deleteEvaluationParam);

// --- Project evaluations ---
router.get("/get-project-evaluations", getProjectEvaluations);
router.get("/get-project-evaluation/:projectId", getProjectEvaluationById);
router.put(
  "/project-evaluations/:projectId/:parameterId",
  updateProjectEvaluation
);

export default router;
