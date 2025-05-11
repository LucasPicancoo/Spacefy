import mongoose, { Schema } from "mongoose";
import { IAssessment } from "../types/assessment";

const AssessmentSchema: Schema = new Schema({
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  }, // Nota da avaliação

  comment: {
    type: String,
    maxlength: 500,
  }, // Comentário opcional

  evaluationDate: {
    type: Date,
    required: true,
    default: Date.now,
  }, // Data da avaliação

  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  }, // Referência ao usuário

  spaceId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Space",
  }, // Referência ao espaço
});

AssessmentSchema.pre<IAssessment>("save", async function (next) {
  if (this.rating < 1 || this.rating > 5) {
    throw new Error("A nota deve estar entre 1 e 5.");
  }
  next();
});

export default mongoose.model<IAssessment>("Assessment", AssessmentSchema);
