import mongoose, { Schema } from "mongoose";
import { IAssessment } from "../types/assessment"; // importa o tipo

const AssessmentSchema: Schema = new Schema({
  id_avaliacao: { type: Number, required: true, unique: true },
  nota: { type: Number, required: true, min: 1, max: 5 },
  comentario: { type: String, maxlength: 250 },
  data_avaliacao: { type: Date, required: true, default: Date.now },
  id_usuario: { type: Number, required: true },
  id_espaco: { type: Number, required: true },
  score: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  }, // Nota da avaliação (obrigatória, entre 1 e 5)

  comment: { 
    type: String, 
    maxlength: 500 
  }, // Comentário opcional (máximo de 500 caracteres)

  evaluation_date: { 
    type: Date, 
    required: true, 
    default: Date.now 
  }, // Data da avaliação (obrigatória, padrão: data atual)

  user_id: { 
    type: mongoose.Types.ObjectId, 
    required: true 
  }, // ID do usuário que fez a avaliação (ObjectId, obrigatório)
  
  space_id: { 
    type: mongoose.Types.ObjectId, 
    required: true,
    ref: "Space" // Referência à coleção de espaços 
  }, // ID do espaço avaliado (ObjectId, obrigatório)
});

AssessmentSchema.pre<IAssessment>("save", async function (next) {
  if (!this.score || this.score < 1 || this.score > 5) {
    throw new Error("A nota deve estar entre 1 e 5.");
  }

  next();
});

export default mongoose.model<IAssessment>("Assessment", AssessmentSchema);
