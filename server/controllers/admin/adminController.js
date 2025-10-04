// backend/src/controllers/adminController.js
// import sendEmail from "../../services/emailService.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { sendEmail } from "../../services/emailService.js";
import Admin from "../../models/admin.js";
import Guide from "../../models/guide.js";
import Group from "../../models/group.js";
import Division from "../../models/division.js";
import Student from "../../models/student.js";

const generateToken = (id) => {
  return jwt.sign({ id, role: "admin" }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Admin login
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: admin._id,
      email: admin.email,
      token: generateToken(admin._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Admin registration (optional for first seed)
export const registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const admin = await Admin.create({ email, password });

    res.status(201).json({
      _id: admin._id,
      email: admin.email,
      token: generateToken(admin._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// OTP Generations & Change Password

// Generate random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ✅ Forgot Password - send OTP
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const otp = generateOTP();
    admin.otp = otp;
    admin.otpExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes
    await admin.save();

    await sendEmail(admin.email, "Password Reset OTP", `Your OTP is: ${otp}`);

    res.json({ message: "OTP sent to email" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Reset Password with OTP
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) return res.status(404).json({ message: "Admin not found" });
    if (admin.otp !== otp || admin.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // const hashed = await bcrypt.hash(newPassword, 10);
    admin.password = newPassword;
    admin.otp = undefined;
    admin.otpExpiry = undefined;
    await admin.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get Admin Profile
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select(
      "-password -otp -otpExpiry"
    );
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Update Admin Profile
export const updateAdminProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Check if email is already taken by another admin
    if (email) {
      const existingAdmin = await Admin.findOne({
        email,
        _id: { $ne: req.admin.id },
      });
      if (existingAdmin) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (name) admin.name = name;
    if (email) admin.email = email;

    await admin.save();

    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      message: "Profile updated successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Change Password (while logged in)
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.admin.id);

    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await admin.matchPassword(oldPassword);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect old password" });

    admin.password = newPassword;
    await admin.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// controllers/admin/adminController.js
export const getAllGuides = async (req, res) => {
  try {
    const guides = await Guide.find().select("-password -otp -otpExpiry");
    res.status(200).json({
      success: true,
      count: guides.length,
      data: guides,
    });
  } catch (error) {
    console.error("Error fetching guides:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch guides",
    });
  }
};

export const createGuide = async (req, res) => {
  try {
    const { name, expertise, email, phone, password } = req.body;

    if (!name || !expertise || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    // Check if guide already exists
    const existingGuide = await Guide.findOne({ email });
    if (existingGuide) {
      return res.status(409).json({
        success: false,
        message: "Guide already exists with this email",
      });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newGuide = await Guide.create({
      name,
      expertise,
      email,
      phone: phone || null,
      password: hashedPassword,
      status: "approved",
    });

    // Send welcome email with credentials
    try {
      await sendEmail({
        to: newGuide.email,
        type: "GUIDE_CREDENTIALS",
        data: {
          name: newGuide.name,
          email: newGuide.email,
          tempPassword: password,
        },
      });
    } catch (emailErr) {
      console.error("⚠️ Failed to send guide credentials:", emailErr.message);
      // You could optionally notify admin here
    }

    res.status(201).json({
      success: true,
      message: "Guide created successfully",
      data: {
        id: newGuide._id,
        name: newGuide.name,
        email: newGuide.email,
        expertise: newGuide.expertise,
      },
    });
  } catch (error) {
    console.error("❌ Error creating guide:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create guide",
    });
  }
};

// controllers/admin/adminController.js

export const updateGuideStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // ✅ Validate input
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be either 'approved' or 'rejected'",
      });
    }

    // ✅ Find guide
    const guide = await Guide.findById(id);
    if (!guide) {
      return res.status(404).json({
        success: false,
        message: "Guide not found",
      });
    }

    // ✅ Update status
    guide.status = status;
    await guide.save();

    // ✅ (Optional) Send email notification
    try {
      if (status === "approved") {
        await sendEmail({
          to: guide.email,
          type: "GUIDE_APPROVED",
          data: { name: guide.name },
        });
      } else if (status === "rejected") {
        await sendEmail({
          to: guide.email,
          type: "GUIDE_REJECTED",
          data: {
            name: guide.name,
            reason: "Admin's Decision",
          },
        });
      }
    } catch (emailErr) {
      console.error("⚠️ Failed to send status update email:", emailErr.message);
    }

    return res.status(200).json({
      success: true,
      message: `Guide status updated to '${status}'`,
      data: {
        id: guide._id,
        name: guide.name,
        email: guide.email,
        status: guide.status,
      },
    });
  } catch (error) {
    console.error("❌ Error updating guide status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update guide status",
    });
  }
};

/**
 * @desc   Update a guide's details (Admin only)
 * @route  PUT /api/admin/update-guide/:id
 * @access Private (Admin)
 */
export const updateGuide = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, expertise, email, phone, isActive } = req.body;

    // 1️⃣ Find guide
    const guide = await Guide.findById(id);
    if (!guide) {
      return res.status(404).json({ message: "Guide not found" });
    }

    // 2️⃣ Update fields (only if provided)
    if (name) guide.name = name;
    if (expertise) guide.expertise = expertise;
    if (email) guide.email = email;
    if (phone !== undefined) guide.phone = phone;
    if (isActive !== undefined) guide.isActive = isActive;

    // 3️⃣ Save updated guide
    const updatedGuide = await guide.save();

    res.status(200).json({
      message: "Guide updated successfully",
      guide: updatedGuide,
    });
  } catch (error) {
    console.error("❌ Error updating guide:", error);
    res.status(500).json({ message: "Server error while updating guide" });
  }
};

// Get Active Status guides
export const getActiveGuides = async (req, res) => {
  try {
    const guides = await Guide.find({
      status: "approved",
      isActive: true,
    }).select("-password -otp -otpExpiry"); // exclude sensitive fields

    res.status(200).json({
      success: true,
      count: guides.length,
      data: guides,
    });
  } catch (err) {
    console.error("❌ Error fetching active guides:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error while fetching active guides",
    });
  }
};

/**
 * GET /api/admin/get-groups?year=2025
 * Fetch groups filtered by year (optional)
 */
export const getGroupsByYear = async (req, res) => {
  try {
    const { year } = req.query;

    // Build filter dynamically
    const filter = {};
    if (year) {
      filter.year = Number(year);
    }

    const groups = await Group.find(filter)
      .populate("guide", "name email expertise phone") // include guide details
      .exec();

    // Format response for frontend consumption
    const formattedGroups = groups.map((g) => ({
      _id: g._id,
      name: g.name,
      year: g.year,
      projectTitle: g.projectTitle,
      projectDescription: g.projectDescription,
      projectTechnology: g.projectTechnology,
      status: g.status,
      guide: g.guide
        ? {
            _id: g.guide._id,
            name: g.guide.name,
            email: g.guide.email,
            expertise: g.guide.expertise,
            phone: g.guide.phone,
          }
        : null,
      members:
        g.members?.map((m) => ({
          name: m.name || m.studentName || "N/A",
          enrollment: m.enrollment || m.enrollmentNumber || "N/A",
          className: m.className || "N/A",
        })) || [],
    }));

    res.status(200).json({
      success: true,
      count: formattedGroups.length,
      data: formattedGroups,
    });
  } catch (err) {
    console.error("❌ Error fetching groups by year:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error while fetching groups",
    });
  }
};

/**
 * GET /api/admin/get-divisions
 * Fetch all divisions (with optional filters)
 */
export const getDivisions = async (req, res) => {
  try {
    const { course, year, status } = req.query;

    // Build filter dynamically
    const filter = {};
    if (course) filter.course = course;
    if (year) filter.year = Number(year);
    if (status) filter.status = status;

    const divisions = await Division.find(filter)
      .sort({ createdAt: -1 })
      .exec();

    res.status(200).json({
      success: true,
      count: divisions.length,
      data: divisions,
    });
  } catch (err) {
    console.error("❌ Error fetching divisions:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error while fetching divisions",
    });
  }
};

/**
 * GET /api/admin/get-group/:id
 * Fetch detailed group info by ID
 */
export const getGroupById = async (req, res) => {
  try {
    const { id } = req.params;

    const group = await Group.findById(id)
      .populate("guide", "name email expertise") // fetch guide details
      .populate("division", "course semester year status") // fetch division details
      .populate("students", "studentName enrollmentNumber") // fetch student list
      .exec();

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    res.status(200).json({
      success: true,
      data: group,
    });
  } catch (err) {
    console.error("❌ Error fetching group details:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error while fetching group details",
    });
  }
};

/**
 * GET /api/admin/get-available-students
 * Fetch all students who are not currently part of any group
 */
export const getAvailableStudents = async (req, res) => {
  try {
    // Step 1: Find all student IDs already assigned to groups
    const groupedStudents = await Group.find({}, "students").lean();
    const assignedStudentIds = groupedStudents.flatMap((g) => g.students);

    // Step 2: Query students not in that list
    const availableStudents = await Student.find({
      _id: { $nin: assignedStudentIds },
    })
      .populate("division", "course semester year status")
      .select("studentName enrollmentNumber division isRegistered")
      .exec();

    res.status(200).json({
      success: true,
      count: availableStudents.length,
      data: availableStudents,
    });
  } catch (err) {
    console.error("❌ Error fetching available students:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error while fetching available students",
    });
  }
};

/**
 * GET /api/admin/get-students-by-group/:id
 * Fetch all students in a specific group
 */
export const getStudentsByGroup = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the group and populate students
    const group = await Group.findById(id)
      .populate(
        "students",
        "studentName enrollmentNumber division isRegistered"
      )
      .populate("division", "course semester year")
      .exec();

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    res.status(200).json({
      success: true,
      groupId: group._id,
      groupName: group.name,
      division: group.division,
      studentCount: group.students.length,
      students: group.students,
    });
  } catch (err) {
    console.error("❌ Error fetching students by group:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error while fetching students by group",
    });
  }
};

/**
 * DELETE /api/admin/delete-group/:id
 * Delete a group
 */
export const deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;

    const group = await Group.findById(id);
    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    await Group.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Group deleted successfully",
    });
  } catch (err) {
    console.error("❌ Error deleting group:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error while deleting group",
    });
  }
};

// GET /api/admin/get-groups (with course, semester, year filters)
export const getGroups = async (req, res) => {
  try {
    const { course, semester, year } = req.query;
    const filter = {};
    if (course) filter["division.course"] = course; // Assuming populated division
    if (semester) filter["division.semester"] = Number(semester);
    if (year) filter.year = Number(year);

    const groups = await Group.find(filter)
      .populate("guide", "name email expertise phone")
      .populate("division", "course semester year")
      .populate("students", "studentName enrollmentNumber division")
      .exec();

    // Format members snapshot for frontend (fallback to students if snapshot empty)
    const formattedGroups = groups.map((g) => ({
      _id: g._id,
      name: g.name,
      year: g.year,
      projectTitle: g.projectTitle,
      projectDescription: g.projectDescription,
      projectTechnology: g.projectTechnology,
      status: g.status,
      guide: g.guide
        ? {
            _id: g.guide._id,
            name: g.guide.name,
            email: g.guide.email,
            expertise: g.guide.expertise,
            phone: g.guide.phone,
          }
        : null,
      members:
        g.membersSnapshot.length > 0
          ? g.membersSnapshot.map((m) => ({
              name: m.name,
              enrollment: m.enrollmentNumber,
              className: `${m.divisionCourse} ${m.divisionSemester}`, // Store these in snapshot if needed
            }))
          : g.students.map((s) => ({
              name: s.studentName,
              enrollment: s.enrollmentNumber,
              className: `${s.division.course} ${s.division.semester}`,
            })),
      divisionId: g.division._id, // For available students fetch
    }));

    res.status(200).json({
      success: true,
      count: formattedGroups.length,
      data: formattedGroups,
    });
  } catch (err) {
    console.error("❌ Error fetching groups:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Server error while fetching groups" });
  }
};

// GET /api/admin/groups/:id/students/available (group-specific, filtered by division)
export const getAvailableStudentsForGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { course, semester, year } = req.query;

    if (!course || !semester || !year) {
      return res
        .status(400)
        .json({ success: false, message: "Missing division filters" });
    }

    // Find assigned student IDs in this group
    const group = await Group.findById(id).select("students");
    const assignedIds = group ? group.students : [];

    // Find unassigned students in the same division
    const availableStudents = await Student.find({
      _id: { $nin: assignedIds },
      "division.course": course,
      "division.semester": Number(semester),
      "division.year": Number(year),
    })
      .populate("division", "course semester year")
      .select("studentName enrollmentNumber division")
      .exec();

    res.status(200).json({
      success: true,
      count: availableStudents.length,
      data: availableStudents.map((s) => ({
        enrollmentNumber: s.enrollmentNumber,
        name: s.studentName,
        className: `${s.division.course} ${s.division.semester}`,
      })),
    });
  } catch (err) {
    console.error(
      "❌ Error fetching available students for group:",
      err.message
    );
    res
      .status(500)
      .json({
        success: false,
        message: "Server error while fetching available students",
      });
  }
};

// Fix: PUT /api/admin/update-group/:id (handle guide change and members add/remove properly)
export const updateGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { guideId, addStudentIds, removeStudentId } = req.body; // Use IDs for accuracy

    const group = await Group.findById(id).populate(
      "students",
      "studentName enrollmentNumber division"
    );
    if (!group) {
      return res
        .status(404)
        .json({ success: false, message: "Group not found" });
    }

    // Change guide
    if (guideId) {
      group.guide = guideId;
    }

    // Add students (if provided; assumes addStudentIds is array of Student _ids)
    if (addStudentIds && addStudentIds.length > 0) {
      if (group.students.length + addStudentIds.length > 4) {
        return res
          .status(400)
          .json({ success: false, message: "Cannot exceed 4 members" });
      }
      const newStudents = await Student.find({ _id: { $in: addStudentIds } });
      group.students.push(...addStudentIds);
      group.membersSnapshot.push(
        ...newStudents.map((s) => ({
          studentRef: s._id,
          enrollmentNumber: s.enrollmentNumber,
          name: s.studentName,
          joinedAt: new Date(),
          // Store division snapshot for frontend
          divisionCourse: s.division.course,
          divisionSemester: s.division.semester,
        }))
      );
    }

    // Remove student (if provided; removeStudentId is Student _id)
    if (removeStudentId) {
      if (group.students.length <= 3) {
        return res
          .status(400)
          .json({ success: false, message: "Minimum 3 members required" });
      }
      group.students = group.students.filter(
        (sId) => sId.toString() !== removeStudentId
      );
      group.membersSnapshot = group.membersSnapshot.filter(
        (ms) => ms.studentRef.toString() !== removeStudentId
      );
    }

    await group.save();
    await group.populate("guide", "name email expertise phone");
    await group.populate("students", "studentName enrollmentNumber division");

    res.status(200).json({
      success: true,
      message: "Group updated successfully",
      data: {
        ...group.toObject(),
        members: group.membersSnapshot.map((ms) => ({
          name: ms.name,
          enrollment: ms.enrollmentNumber,
          className: `${ms.divisionCourse} ${ms.divisionSemester}`,
        })),
      },
    });
  } catch (err) {
    console.error("❌ Error updating group:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Server error while updating group" });
  }
};
