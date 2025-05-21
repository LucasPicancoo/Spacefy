import mongoose, { Schema } from "mongoose";
import { IAssessment } from "../types/assessment";

const assessmentSchema = new Schema<IAssessment>({
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },
  comment: {
    type: String,
    required: false
  },
  evaluation_date: {
    type: Date,
    required: true,
    default: Date.now
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  spaceID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Space",
    required: true
  }
}, {
  // Desabilita a criação automática de índices
  autoIndex: false
});

// Remove todos os índices existentes
assessmentSchema.indexes().forEach(index => {
  assessmentSchema.index(index[0], { ...index[1], unique: false });
});

// Adiciona apenas os índices necessários
assessmentSchema.index({ spaceID: 1 });
assessmentSchema.index({ userID: 1 });
assessmentSchema.index({ evaluation_date: -1 });
assessmentSchema.index({ userID: 1, spaceID: 1 });

export default mongoose.model<IAssessment>("Assessment", assessmentSchema);
