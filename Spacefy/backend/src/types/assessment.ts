import mongoose, { Document } from "mongoose";

export interface IAssessment extends Document {
  id_avaliacao: number;
  nota: number;
  comentario?: string;
  data_avaliacao: Date;
  id_usuario: number;
  id_espaco: number;
  score: number; // Nota da avaliação
  comment?: string; // Comentário opcional
  evaluation_date: Date; // Data da avaliação
  user_id: mongoose.Types.ObjectId; // ID do usuário que fez a avaliação (ObjectId)
  space_id: mongoose.Types.ObjectId; // ID do espaço avaliado (ObjectId)
}
