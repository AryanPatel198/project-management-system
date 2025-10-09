import mongoose from "mongoose";

const projectEvaluationSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    parameterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EvaluationParameter",
      required: true,
    },
    givenMarks: {
      type: Number,
      min: 0,
      default: null, // null means not evaluated yet
    },
    evaluatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true }
);

const ProjectEvaluation = mongoose.model(
  "ProjectEvaluation",
  projectEvaluationSchema
);
export default ProjectEvaluation;
