import mongoose from "mongoose";
import bcrypt from "bcrypt";

const guideSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 50,
      trim: true,
    },
    expertise: {
      type: String,
      required: true,
      maxlength: 50,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // ✅ ensure no duplicate accounts
      maxlength: 100,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    phone: {
      type: String,
      maxlength: 15, // ✅ Allow up to 15 digits (international format)
      match: [/^\+?[0-9]{7,15}$/, "Please use a valid phone number"],
      default: null,
    },
    password: {
      type: String,
      required: true,
      minlength: 4,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending", // ✅ Admin decides whether guide is approved
    },
    isActive: {
      type: Boolean,
      default: true, // ✅ true = available to take groups, false = unavailable
    },
    assignedGroups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group", // will connect later
      },
    ],
    otp: String, // for reset password
    otpExpiry: Date,
  },
  { timestamps: true }
);

// 🔑 Hash password before saving
guideSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔑 Compare password method
guideSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Guide = mongoose.model("Guide", guideSchema);
export default Guide;
