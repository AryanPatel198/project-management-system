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

// ✅ PUT /api/admin/update-guide/:id
router.put("/update-guide/:id", protectAdmin, updateGuide);

// PATCH /api/admin/new-guide-status/:id
router.patch("/new-guide-status/:id", protectAdmin, updateGuideStatus);

export default router;
