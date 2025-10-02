import Student from "../models/student.js";
import Division from "../models/division.js";
import jwt from "jsonwebtoken";

// GET /api/student/divisions - list active divisions
export const getActiveDivisions = async (req, res) => {
  try {
    const divisions = await Division.find({ status: "active" })
      .sort({ year: -1, course: 1, semester: 1 })
      .lean();
    res.json(divisions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch divisions" });
  }
};

// GET /api/student/pending-enrollments?divisionId=... - enrollment numbers not registered yet for a division
export const getPendingEnrollments = async (req, res) => {
  try {
    const { divisionId } = req.query;
    if (!divisionId) return res.status(400).json({ message: "divisionId is required" });

    const students = await Student.find({ division: divisionId, status: { $ne: "approved" } })
      .select("enrollmentNumber name")
      .sort({ enrollmentNumber: 1 })
      .lean();

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch enrollments" });
  }
};

// POST /api/student/register - body: { divisionId, enrollmentNumber, name, phone, password }
export const registerStudent = async (req, res) => {
  try {
    const { divisionId, enrollmentNumber, name, phone, password } = req.body;
    if (!divisionId || !enrollmentNumber || !name || !password) {
      return res.status(400).json({ message: "divisionId, enrollmentNumber, name, password are required" });
    }

    const division = await Division.findById(divisionId);
    if (!division || division.status !== "active") {
      return res.status(400).json({ message: "Invalid or inactive division" });
    }

    const student = await Student.findOne({ enrollmentNumber, division: divisionId });
    if (!student) {
      return res.status(404).json({ message: "Enrollment not found for this division" });
    }

    // Update allowed fields and mark approved
    student.name = name;
    if (phone) student.phone = phone;
    student.password = password; // will be hashed by pre-save hook
    student.status = "approved";
    await student.save();

    res.status(200).json({ message: "Registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Registration failed" });
  }
};

// POST /api/student/login - body: { enrollmentNumber, password }
export const loginStudent = async (req, res) => {
  try {
    const { enrollmentNumber, password } = req.body;
    if (!enrollmentNumber || !password) {
      return res.status(400).json({ message: "Enrollment number and password are required" });
    }

    const student = await Student.findOne({ enrollmentNumber }).populate("division");
    if (!student || student.status !== "approved") {
      return res.status(401).json({ message: "Invalid enrollment number or password" });
    }

    const isMatch = await student.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid enrollment number or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: student._id, role: "student", division: student.division._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      _id: student._id,
      enrollmentNumber: student.enrollmentNumber,
      name: student.name,
      division: student.division,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};


