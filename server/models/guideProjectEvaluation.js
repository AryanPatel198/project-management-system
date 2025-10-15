import mongoose from "mongoose";

const guideProjectEvaluationSchema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
      index: true,
    },
    guide: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guide",
      required: true,
      index: true,
    },
    technicalScore: { type: Number, min: 0, default: 0 },
    presentationScore: { type: Number, min: 0, default: 0 },
    documentationScore: { type: Number, min: 0, default: 0 },
    innovationScore: { type: Number, min: 0, default: 0 },
    overallScore: { type: Number, min: 0, default: 0 },
    status: {
      type: String,
      enum: ["Pending Evaluation", "Under Review", "Completed"],
      default: "Pending Evaluation",
    },
    lastEvaluatedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

guideProjectEvaluationSchema.index({ group: 1, guide: 1 }, { unique: true });

const GuideProjectEvaluation = mongoose.model(
  "GuideProjectEvaluation",
  guideProjectEvaluationSchema
);

export default GuideProjectEvaluation;


