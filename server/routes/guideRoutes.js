import express from "express";
import { protectGuide } from "../middlewares/authMiddleware.js";
import {
  registerGuide,
  loginGuide,
  getAuthenticatedGuide,
  updateAuthenticatedGuide,
  changeGuidePassword,
  getGuideProfileById,
  updateGuideProfile,
  getGuideDashboard,
  getGuideAnnouncements,
  getGuideGroups,
  createGroupForGuide,
  getGroupByIdForGuide,
  updateGroupForGuide,
  deleteGroupForGuide,
} from "../controllers/guideController.js";

const router = express.Router();

// POST /api/auth/guide/register
router.post("/auth/guide/register", registerGuide);

// POST /api/auth/guide/login
router.post("/auth/guide/login", loginGuide);

// GET /api/auth/guide/me
router.get("/auth/guide/me", protectGuide, getAuthenticatedGuide);

// PUT /api/auth/guide/me
router.put("/auth/guide/me", protectGuide, updateAuthenticatedGuide);

// PUT /api/auth/guide/change-password
router.put("/auth/guide/change-password", protectGuide, changeGuidePassword);

// GET /api/guides/:id/profile
router.get("/guides/:id/profile", protectGuide, getGuideProfileById);

// PUT /api/guides/:id/profile (New route for update)
router.put("/guides/:id/profile", protectGuide, updateGuideProfile); // <--- Added PUT route

// GET /api/guides/:id/dashboard
router.get("/guides/:id/dashboard", protectGuide, getGuideDashboard);

// GET /api/guides/:id/announcements
router.get("/guides/:id/announcements", protectGuide, getGuideAnnouncements);

// Groups CRUD under guide
router.get("/guides/:id/groups", protectGuide, getGuideGroups);
router.post("/guides/:id/groups", protectGuide, createGroupForGuide);
router.get("/guides/:id/groups/:groupId", protectGuide, getGroupByIdForGuide);
router.put("/guides/:id/groups/:groupId", protectGuide, updateGroupForGuide);
router.delete("/guides/:id/groups/:groupId", protectGuide, deleteGroupForGuide);

export default router;
