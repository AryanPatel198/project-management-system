// backend/src/controllers/adminController.js
// import sendEmail from "../../services/emailService.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { sendEmail } from "../../services/emailService.js";
import Admin from "../../models/admin.js";
import Guide from "../../models/guide.js";

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

