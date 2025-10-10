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
  updateGroup,
  deleteGroup,
  updateGroupGuide,
  getEvaluationParams,
  updateEvaluationParam,
  addEvaluationParam,
  deleteEvaluationParam,
  getStudentEnrollments,
  updateDivisionStatus,
  addDivision,
  deleteDivision,
  generateEnrollments,
  getEnrollmentsByDivision,
  removeStudentById,
  removeAllStudentsByDivision,
  addStudentEnrollment,
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

// PUT /api/admin/update-group/:id
router.put("/update-group/:id", protectAdmin, updateGroup);

// DELETE /api/admin/delete-group/:id
router.delete("/delete-group/:id", protectAdmin, deleteGroup);

// GET /api/admin/get-groups (with filters)
router.get("/get-groups", protectAdmin, getGroups);

// GET /api/admin/groups/:id/students/available
router.get(
  "/groups/:id/students/available",
  protectAdmin,
  getAvailableStudentsForGroup
);

// PUT /api/admin/update-group-guide/:id
router.put("/update-group-guide/:id", protectAdmin, updateGroupGuide);

// GET /api/admin/get-evaluation-params
router.get("/get-evaluation-params", protectAdmin, getEvaluationParams);

// PUT /api/admin/update-evaluation-param/:id
router.put("/update-evaluation-param/:id", protectAdmin, updateEvaluationParam);

// POST /api/admin/add-evaluation-param
router.post("/add-evaluation-param", protectAdmin, addEvaluationParam);

// DELETE /api/admin/delete-evaluation-param/:id
router.delete(
  "/delete-evaluation-param/:id",
  protectAdmin,
  deleteEvaluationParam
);

// GET /api/admin/get-student-enrollments
router.get("/get-student-enrollments", protectAdmin, getStudentEnrollments);

// PATCH /api/admin/update-division-status/:id
router.patch("/update-division-status/:id", protectAdmin, updateDivisionStatus);

// POST /api/admin/add-division
router.post("/add-division", protectAdmin, addDivision);

// DELETE /api/admin/delete-division/:id
router.delete("/delete-division/:id", protectAdmin, deleteDivision);

router.post("/generate-enrollments", generateEnrollments);

router.get("/get-enrollment-by-division/:id", getEnrollmentsByDivision);

// DELETE /api/admin/remove-student/:id
router.delete("/remove-student/:id", removeStudentById);

// DELETE /api/admin/remove-all-students/:id
router.delete("/remove-all-students/:id", removeAllStudentsByDivision);

// Add a single student enrollment
router.post("/add-student-enrollment", addStudentEnrollment);

export default router;
