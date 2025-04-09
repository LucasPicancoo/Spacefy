// Importa o Mongoose para trabalhar com MongoDB e definir tipos e esquemas
import mongoose, { Schema, Document } from "mongoose";

// Define a interface para os atributos de uma avaliação
export interface IAssessment extends Document {
  id_avaliacao: number; // ID da avaliação
  nota: number; // Nota da avaliação
  comentario?: string; // Comentário opcional
  data_avaliacao: Date; // Data da avaliação
  id_usuario: number; // ID do usuário que fez a avaliação
  id_espaco: number; // ID do espaço avaliado
}

// Define o esquema da avaliação no MongoDB, incluindo validações e atributos
const AssessmentSchema: Schema = new Schema({
  id_avaliacao: { type: Number, required: true, unique: true }, // ID da avaliação (obrigatório e único)
  nota: { type: Number, required: true, min: 1, max: 5 }, // Nota da avaliação (obrigatória, entre 1 e 5)
  comentario: { type: String, maxlength: 250 }, // Comentário opcional (máximo de 250 caracteres)
  data_avaliacao: { type: Date, required: true, default: Date.now }, // Data da avaliação (obrigatória, padrão: data atual)
  id_usuario: { type: Number, required: true }, // ID do usuário que fez a avaliação (obrigatório)
  id_espaco: { type: Number, required: true }, // ID do espaço avaliado (obrigatório)
});

// Middleware que pode ser usado para validações ou transformações antes de salvar
AssessmentSchema.pre<IAssessment>("save", async function (next) {
  // Validação adicional para garantir que a nota esteja no intervalo correto
  if (!this.nota || this.nota < 1 || this.nota > 5) {
    throw new Error("A nota deve estar entre 1 e 5.");
  }

  next(); // Continua o fluxo de execução
});

// Exporta o modelo "Assessment" baseado no esquema AssessmentSchema
// O modelo será usado para interagir com a coleção "Assessment" no MongoDB
export default mongoose.model<IAssessment>("Assessment", AssessmentSchema);