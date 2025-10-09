import mongoose from "mongoose";

const evaluationParameterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    marks: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

const EvaluationParameter = mongoose.model(
  "EvaluationParameter",
  evaluationParameterSchema
);
export default EvaluationParameter;
