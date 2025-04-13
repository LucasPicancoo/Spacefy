// Importa o Mongoose para trabalhar com MongoDB e definir tipos e esquemas
import mongoose, { Schema, Document } from "mongoose";

// Define a interface para os atributos de uma reserva
export interface IReservation extends Document {
  user_id: mongoose.Types.ObjectId; // ID do usuário que fez a reserva (ObjectId)
  space_id: mongoose.Types.ObjectId; // ID do espaço reservado (ObjectId)
  start_date: Date; // Data de início da reserva
  end_date: Date; // Data de término da reserva
  status: string; // Status da reserva (ex.: "pending", "confirmed", "canceled")
  created_at: Date; // Data de criação da reserva
}

// Define o esquema da reserva no MongoDB, incluindo validações e atributos
const ReservationSchema: Schema = new Schema({
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
    enum: ["pendente", "confirmada", "cancelada"], // Status permitido
    default: "pendente" // Valor padrão
  }, // Status da reserva
  created_at: { type: Date, required: true, default: Date.now }, // Data de criação da reserva (obrigatória, padrão: data atual)
});

// Middleware que pode ser usado para validações ou transformações antes de salvar
ReservationSchema.pre<IReservation>("save", async function (next) {
  // Validação: A data de início deve ser anterior à data de término
  if (this.start_date >= this.end_date) {
    throw new Error("A data de início deve ser anterior à data de término.");
  }

  next(); // Continua o fluxo de execução
});

// Exporta o modelo "Reservation" baseado no esquema ReservationSchema
// O modelo será usado para interagir com a coleção "Reservation" no MongoDB
export default mongoose.model<IReservation>("Reservation", ReservationSchema);