// Importa os tipos Document e ObjectId do Mongoose para definir a estrutura dos documentos no banco de dados
import mongoose, { Document, ObjectId } from "mongoose";

// Interface para reservas, representando os campos comuns a todas as reservas
export interface IReservation extends Document {
  _id: ObjectId; // ID da reserva
  start_date: Date; // Data de início da reserva
  end_date: Date; // Data de término da reserva
  status: "pending" | "confirmed" | "canceled"; // Status da reserva
  created_at: Date; // Data de criação da reserva
  user_object_id: mongoose.Types.ObjectId; // ID do usuário (ObjectId do MongoDB)
  space_object_id: mongoose.Types.ObjectId; // ID do espaço (ObjectId do MongoDB)
}
