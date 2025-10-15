import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    guide: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guide",
      required: true,
    },
    projectTitle: {
      type: String,
      default: "",
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 4000,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    recommendations: {
      type: String,
      default: "",
      trim: true,
      maxlength: 4000,
    },
    status: {
      type: String,
      enum: ["Submitted", "Pending Response", "Completed"],
      default: "Submitted",
    },
    response: {
      type: String,
      default: "",
      trim: true,
      maxlength: 4000,
    },
  },
  { timestamps: true }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;


