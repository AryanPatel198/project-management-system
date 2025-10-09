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
  getAvailableStudents,
  getStudentsByGroup,
  getEvaluationParams,
  addEvaluationParam,
  updateEvaluationParam,
  deleteEvaluationParam,
  getProjectEvaluations,
  getProjectEvaluationById,
  updateGroup,
  updateProjectEvaluation,
} from "../../controllers/admin/adminController.js";
import { protectAdmin } from "../../middlewares/authMiddleware.js";

const router = express.Router();

// POST /api/admin/login
router.post("/login", loginAdmin);

// POST /api/admin/register (optional for seeding first admin)
router.post("/register", registerAdmin);

// Forgot
router.post("/forgot-password", forgotPassword);

// Reset;
router.post("/reset-password", resetPassword);

// Protected routes (require authentication)
router.use(protectAdmin);

// GET /api/admin/profile
router.get("/profile", getAdminProfile);

// PUT /api/admin/profile
router.put("/profile", updateAdminProfile);

// Change password
router.post("/change-password", changePassword);

// Manage Guides apis
// GET /api/admin/guides -> returns list of guides
router.get("/get-all-guides", protectAdmin, getAllGuides);

// POST /api/admin/add-guide
router.post("/add-guide", protectAdmin, createGuide);

// PUT /api/admin/update-guide/:id
router.put("/update-guide/:id", protectAdmin, updateGuide);

// PATCH /api/admin/new-guide-status/:id
router.patch("/new-guide-status/:id", protectAdmin, updateGuideStatus);

// GET /api/admin/active-guides
router.get("/active-guides", protectAdmin, getActiveGuides);

// GET /api/admin/get-groups?year=2025
router.get("/get-groups", protectAdmin, getGroupsByYearOrCourse);

// GET /api/admin/get-divisions
router.get("/get-divisions", protectAdmin, getDivisions);

// GET /api/admin/get-group/:id
router.get("/get-group/:id", protectAdmin, getGroupById);

// GET /api/admin/get-available-students
router.get("/get-available-students", protectAdmin, getAvailableStudents);

// GET /api/admin/get-students-by-group/:id
router.get("/get-students-by-group/:id", protectAdmin, getStudentsByGroup);

// GET /api/admin/get-evaluation-params
router.get("/get-evaluation-params", protectAdmin, getEvaluationParams);

// POST new evaluation parameter
router.post("/add-evaluation-param", protectAdmin, addEvaluationParam);

// PUT update evaluation parameter
router.put("/update-evaluation-param/:id", protectAdmin, updateEvaluationParam);

// DELETE evaluation parameter
router.delete(
  "/delete-evaluation-param/:id",
  protectAdmin,
  deleteEvaluationParam
);

//  * GET /api/admin/get-project-evaluations
router.get("/get-project-evaluations", protectAdmin, getProjectEvaluations);

// GET /api/admin/get-project-evaluation/:projectId
router.get("/get-project-evaluation/:projectId", getProjectEvaluationById);

// PUT /api/admin/update-group/:id
router.put("/update-group/:id", updateGroup);

// PUT /api/admin/project-evaluations/:projectId/:parameterId
router.put(
  "/project-evaluations/:projectId/:parameterId",
  updateProjectEvaluation
);

export default router;
