import mongoose from "mongoose";

const divisionSchema = new mongoose.Schema(
  {
    course: {
      type: String,
      enum: ["BCA", "MCA", "BBA", "MBA", "MSCIT"],
      required: true,
      trim: true,
    },
    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },
    year: {
      type: Number,
      required: true,
      min: 2020,
      max: 2035,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

// Prevent duplicate divisions
divisionSchema.index({ course: 1, semester: 1, year: 1 }, { unique: true });

const Division = mongoose.model("Division", divisionSchema);

export default Division;
