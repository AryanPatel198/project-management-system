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
      index: true, // for faster lookup
    },
    name: {
      type: String,
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
      type: String, // hashed if used for authentication
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
    // 🆕 replaced status field with a clean boolean flag
    isRegistered: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Hash password before saving (if password is set)
studentSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Password match helper
studentSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password || "");
};

const Student = mongoose.model("Student", studentSchema);

export default Student;
