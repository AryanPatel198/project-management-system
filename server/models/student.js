import mongoose from "mongoose";
import bcrypt from "bcrypt";

const studentSchema = new mongoose.Schema(
  {
    enrollmentNumber: {
      type: String,
      required: true,
      unique: true,
      maxlength: 20,
      trim: true,
      index: true, // fast lookup
    },
    name: {
      type: String,
      required: true,
      maxlength: 100,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true, // allows some students without email
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      maxlength: 15,
    },
    password: {
      type: String, // hash if using auth
    },
    division: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Division",
      required: true,
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      default: null, // one group per student
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Hash password before saving
studentSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password helper
studentSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password || "");
};

const Student = mongoose.model("Student", studentSchema);

export default Student;
