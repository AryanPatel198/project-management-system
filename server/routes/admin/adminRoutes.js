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
} from "../../controllers/admin/adminController.js";
import { protectAdmin } from "../../middlewares/authMiddleware.js";

const router = express.Router();

// POST /api/admin/login
router.post("/login", loginAdmin);

// POST /api/admin/register (optional for seeding first admin)
router.post("/register", registerAdmin);

// Forgot + Reset
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Protected routes (require authentication)
router.use(protectAdmin);

// GET /api/admin/profile
router.get("/profile", getAdminProfile);

// PUT /api/admin/profile
router.put("/profile", updateAdminProfile);

// Change password
router.post("/change-password", changePassword);

export default router;
