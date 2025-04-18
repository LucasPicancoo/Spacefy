import mongoose, { Schema } from "mongoose";
import { IReservation } from "../types/reserve";

// Define o esquema da reserva no MongoDB
const ReservationSchema: Schema = new Schema({
  id_reserva: { type: Number, required: true, unique: true },
  id_usuario: { type: Number, required: true },
  id_espaco: { type: Number, required: true },
  data_inicio: { type: Date, required: true },
  data_fim: { type: Date, required: true },

  user_id: { 
    type: mongoose.Types.ObjectId, 
    required: true, 
    ref: "User" // Referência à coleção de usuários
  }, // ID do usuário que fez a reserva (ObjectId, obrigatório)

  space_id: { 
    type: mongoose.Types.ObjectId, 
    required: true, 
    ref: "Space" // Referência à coleção de espaços
  }, // ID do espaço reservado (ObjectId, obrigatório)
  
  start_date: { 
    type: Date, 
    required: true 
  }, // Data de início da reserva (obrigatória)

  end_date: { 
    type: Date, 
    required: true 
  }, // Data de término da reserva (obrigatória)

  status: {
    type: String,
    required: true,
    enum: ["pendente", "confirmada", "cancelada"],
    default: "pendente",
  },
  criado_em: { type: Date, required: true, default: Date.now },
});

// Middleware para validações antes de salvar
ReservationSchema.pre<IReservation>("save", async function (next) {
  if (this.start_date >= this.end_date) {
     throw new Error("A data de início deve ser anterior à data de término.");
   }
  next();
});

export default mongoose.model<IReservation>("Reservation", ReservationSchema);
