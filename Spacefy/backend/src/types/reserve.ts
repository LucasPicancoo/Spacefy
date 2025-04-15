import mongoose, { Document } from "mongoose";

// Interface para os atributos de uma reserva
export interface IReservation extends Document {
  id_reserva: number;
  id_usuario: number;
  id_espaco: number;
  data_inicio: Date;
  data_fim: Date;
  status: "pendente" | "confirmada" | "cancelada";
  criado_em: Date;
  user_id: mongoose.Types.ObjectId; // ID do usuário que fez a reserva (ObjectId)
  space_id: mongoose.Types.ObjectId; // ID do espaço reservado (ObjectId)
  start_date: Date; // Data de início da reserva
  end_date: Date; // Data de término da reserva
  created_at: Date; // Data de criação da reserva
}
