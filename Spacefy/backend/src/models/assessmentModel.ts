// Importa o Mongoose para trabalhar com MongoDB e definir tipos e esquemas
import mongoose, { Schema, Document } from "mongoose";

// Define a interface para os atributos de uma avaliação
export interface IAssessment extends Document {
  score: number; // Nota da avaliação
  comment?: string; // Comentário opcional
  evaluation_date: Date; // Data da avaliação
  user_id: mongoose.Types.ObjectId; // ID do usuário que fez a avaliação (ObjectId)
  space_id: mongoose.Types.ObjectId; // ID do espaço avaliado (ObjectId)
}

// Define o esquema da avaliação no MongoDB, incluindo validações e atributos
const AssessmentSchema: Schema = new Schema({
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

// Middleware que pode ser usado para validações ou transformações antes de salvar
AssessmentSchema.pre<IAssessment>("save", async function (next) {
  // Validação adicional para garantir que a nota esteja no intervalo correto
  if (!this.score || this.score < 1 || this.score > 5) {
    throw new Error("A nota deve estar entre 1 e 5.");
  }

  next(); // Continua o fluxo de execução
});

// Exporta o modelo "Assessment" baseado no esquema AssessmentSchema
// O modelo será usado para interagir com a coleção "Assessment" no MongoDB
export default mongoose.model<IAssessment>("Assessment", AssessmentSchema);