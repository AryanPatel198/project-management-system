import express from "express";
import { protectGuide } from "../middlewares/authMiddleware.js";
import {
  getGuideGroups,
  getGroupByIdForGuide,
} from "../controllers/guideController.js";
import Group from "../models/group.js";
import Student from "../models/student.js";

const router = express.Router();

// All routes require authenticated guide
router.use(protectGuide);

// GET /api/guide-panel/groups - list groups for current guide
router.get("/groups", async (req, res) => {
  try {
    // Reuse controller formatting by calling underlying logic
    req.params.id = req.guide._id.toString();
    return getGuideGroups(req, res);
  } catch (error) {
    console.error("Error listing guide-panel groups:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET /api/guide-panel/groups/:groupId - group details for current guide
router.get("/groups/:groupId", async (req, res) => {
  try {
    req.params.id = req.guide._id.toString();
    return getGroupByIdForGuide(req, res);
  } catch (error) {
    console.error("Error getting guide-panel group:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// PUT /api/guide-panel/groups/:groupId/details - update project details and members
router.put("/groups/:groupId/details", async (req, res) => {
  try {
    const guideId = req.guide._id.toString();
    const { groupId } = req.params;
    const {
      projectTitle,
      projectDescription,
      year,
      technology,
      members = [], // array of student ids
    } = req.body || {};

    const group = await Group.findOne({ _id: groupId, guide: guideId });
    if (!group) {
      return res
        .status(404)
        .json({ success: false, message: "Group not found" });
    }

    if (Array.isArray(members)) {
      if (members.length < 3 || members.length > 4) {
        return res
          .status(400)
          .json({ success: false, message: "Group must have 3-4 members" });
      }
      // Validate students exist and are either unassigned or already in this group
      const students = await Student.find({ _id: { $in: members } });
      if (students.length !== members.length) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid student list" });
      }

      // Ensure students are not part of another group
      const conflicting = await Student.find({
        _id: { $in: members },
        $and: [
          { $or: [{ group: { $ne: null } }, { group: { $exists: true } }] },
          { group: { $ne: group._id } },
        ],
      });
      if (conflicting.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Some students are already assigned to another group",
        });
      }

      // Detach current students previously in this group but not in new list
      await Student.updateMany(
        { group: group._id, _id: { $nin: members } },
        { $set: { group: null } }
      );

      // Attach new students to this group
      await Student.updateMany(
        { _id: { $in: members } },
        { $set: { group: group._id } }
      );

      group.students = members;
      // Maintain a simple snapshot for auditing
      group.membersSnapshot = students.map((s) => ({
        studentRef: s._id,
        enrollmentNumber: s.enrollmentNumber,
        name: s.name,
      }));
    }

    if (projectTitle !== undefined) group.projectTitle = projectTitle;
    if (projectDescription !== undefined)
      group.projectDescription = projectDescription;
    if (technology !== undefined) group.projectTechnology = technology;
    if (year !== undefined) group.year = year;

    await group.save();

    const populated = await Group.findById(group._id)
      .populate("students", "name email enrollmentNumber")
      .lean();

    return res.status(200).json({
      data: {
        id: populated._id,
        groupName: populated.name,
        projectTitle: populated.projectTitle || "",
        description: populated.projectDescription || "",
        technology: populated.projectTechnology || "",
        year: populated.year,
        status: populated.status,
        members: (populated.students || []).map((s) => ({
          id: s._id,
          name: s.name,
          enrollmentNumber: s.enrollmentNumber,
          email: s.email,
        })),
      },
    });
  } catch (error) {
    console.error("Error updating group details:", error.message);
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET /api/guide-panel/students/search?enrollment=123
router.get("/students/search", async (req, res) => {
  try {
    const { enrollment = "" } = req.query;
    const regex = new RegExp(`^${String(enrollment).trim()}`, "i");
    const students = await Student.find({
      enrollmentNumber: { $regex: regex },
    })
      .select("name email enrollmentNumber group")
      .limit(20)
      .lean();

    res.status(200).json({
      data: students.map((s) => ({
        _id: s._id,
        name: s.name,
        email: s.email,
        enrollmentNumber: s.enrollmentNumber,
        isAssigned: !!s.group,
      })),
    });
  } catch (error) {
    console.error("Error searching students:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET /api/guide-panel/groups/:groupId/available-students
router.get("/groups/:groupId/available-students", async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findOne({ _id: groupId, guide: req.guide._id });
    if (!group) {
      return res
        .status(404)
        .json({ success: false, message: "Group not found" });
    }

    const available = await Student.find({ $or: [{ group: null }, { group: groupId }] })
      .select("name enrollmentNumber email")
      .limit(100)
      .lean();

    res.status(200).json({
      data: available.map((s) => ({
        _id: s._id,
        name: s.name,
        enrollmentNumber: s.enrollmentNumber,
        email: s.email,
      })),
    });
  } catch (error) {
    console.error("Error getting available students:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET /api/guide-panel/approvals - list projects for approvals (groups with project title)
router.get("/approvals", async (req, res) => {
  try {
    const guideId = req.guide._id;
    const groups = await Group.find({ guide: guideId, projectTitle: { $ne: null } })
      .populate("students", "name email enrollmentNumber")
      .lean();

    const data = (groups || []).map((g) => ({
      id: g._id,
      title: g.projectTitle || "",
      description: g.projectDescription || "",
      technology: g.projectTechnology || "",
      status: g.status || "Not Started",
      assignedGroup: g.name,
      proposalPdf: g.proposalPdf || "",
      members: (g.students || []).map((s) => ({
        id: s._id,
        name: s.name,
        role: "Member",
        enrollmentNumber: s.enrollmentNumber,
        email: s.email,
      })),
      rejectionReason: g.rejectionReason || "",
    }));

    res.status(200).json({ data });
  } catch (error) {
    console.error("Error listing approvals:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// PUT /api/guide-panel/approvals/:groupId - approve or reject a project
router.put("/approvals/:groupId", async (req, res) => {
  try {
    const { groupId } = req.params;
    const { action, reason } = req.body || {};

    const group = await Group.findOne({ _id: groupId, guide: req.guide._id });
    if (!group) {
      return res.status(404).json({ success: false, message: "Group not found" });
    }

    if (action === "approve") {
      group.status = "Approved";
      group.rejectionReason = "";
    } else if (action === "reject") {
      group.status = "Rejected";
      group.rejectionReason = String(reason || "").slice(0, 1000);
    } else {
      return res.status(400).json({ success: false, message: "Invalid action" });
    }

    await group.save();

    const populated = await Group.findById(group._id)
      .populate("students", "name email enrollmentNumber")
      .lean();

    return res.status(200).json({
      data: {
        id: populated._id,
        title: populated.projectTitle || "",
        description: populated.projectDescription || "",
        technology: populated.projectTechnology || "",
        status: populated.status,
        assignedGroup: populated.name,
        proposalPdf: populated.proposalPdf || "",
        rejectionReason: populated.rejectionReason || "",
        members: (populated.students || []).map((s) => ({
          id: s._id,
          name: s.name,
          role: "Member",
          enrollmentNumber: s.enrollmentNumber,
          email: s.email,
        })),
      },
    });
  } catch (error) {
    console.error("Error updating approval:", error.message);
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;


