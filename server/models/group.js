import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      maxlength: 100,
      trim: true,
    },
    guide: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guide",
      required: true,
    },
    division: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Division",
      required: true,
    },
    projectTitle: {
      type: String,
      maxlength: 200,
      trim: true,
    },
    projectDescription: {
      type: String,
      maxlength: 1000,
      trim: true,
    },
    projectTechnology: {
      type: String,
      maxlength: 100,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
      min: 2020,
      max: 2035,
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    membersSnapshot: [
      {
        studentRef: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
        enrollmentNumber: String,
        name: String,
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    status: {
      type: String,
      enum: ["Not Started", "In Progress", "Completed"],
      default: "Not Started",
    },
  },
  { timestamps: true }
);

const Group = mongoose.model("Group", groupSchema);

export default Group;