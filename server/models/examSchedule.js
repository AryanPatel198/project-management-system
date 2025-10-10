import mongoose from "mongoose";

const examScheduleSchema = new mongoose.Schema(
  {
    course: {
      type: String,
      required: true,
      enum: ["BCA", "MCA"],
    },
    type: {
      type: String,
      required: true,
      enum: ["Exam", "Submission"],
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("ExamSchedule", examScheduleSchema);
