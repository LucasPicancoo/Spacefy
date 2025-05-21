// Importa os tipos Document e ObjectId do Mongoose para definir a estrutura dos documentos no banco de dados
import mongoose, { Document, ObjectId } from "mongoose";

// Interface para avaliações, representando os campos comuns a todas as avaliações
export interface IAssessment extends Document {
  _id: ObjectId; // ID da avaliação
  score: number; // Nota da avaliação
  comment?: string; // Comentário opcional
  evaluation_date: Date; // Data da avaliação
  userID: mongoose.Types.ObjectId; // ID do usuário (ObjectId do MongoDB)
  spaceID: mongoose.Types.ObjectId; // ID do espaço (ObjectId do MongoDB)
}
