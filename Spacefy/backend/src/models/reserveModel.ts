// Importa o Mongoose para trabalhar com MongoDB e definir tipos e esquemas
import mongoose, { Schema, Document } from "mongoose";

// Define a interface para os atributos de uma reserva
export interface IReservation extends Document {
  id_reserva: number; // ID da reserva
  id_usuario: number; // ID do usuário que fez a reserva
  id_espaco: number; // ID do espaço reservado
  data_inicio: Date; // Data de início da reserva
  data_fim: Date; // Data de término da reserva
  status: string; // Status da reserva (ex.: "pendente", "confirmada", "cancelada")
  criado_em: Date; // Data de criação da reserva
}

// Define o esquema da reserva no MongoDB, incluindo validações e atributos
const ReservationSchema: Schema = new Schema({
  id_reserva: { type: Number, required: true, unique: true }, // ID da reserva (obrigatório e único)
  id_usuario: { type: Number, required: true }, // ID do usuário que fez a reserva (obrigatório)
  id_espaco: { type: Number, required: true }, // ID do espaço reservado (obrigatório)
  data_inicio: { type: Date, required: true }, // Data de início da reserva (obrigatória)
  data_fim: { type: Date, required: true }, // Data de término da reserva (obrigatória)
  status: { 
    type: String, 
    required: true, 
    enum: ["pendente", "confirmada", "cancelada"], // Status permitido
    default: "pendente" // Valor padrão
  }, // Status da reserva
  criado_em: { type: Date, required: true, default: Date.now }, // Data de criação da reserva (obrigatória, padrão: data atual)
});

// Middleware que pode ser usado para validações ou transformações antes de salvar
ReservationSchema.pre<IReservation>("save", async function (next) {
  // Validação: A data de início deve ser anterior à data de término
  if (this.data_inicio >= this.data_fim) {
    throw new Error("A data de início deve ser anterior à data de término.");
  }

  next(); // Continua o fluxo de execução
});

// Exporta o modelo "Reservation" baseado no esquema ReservationSchema
// O modelo será usado para interagir com a coleção "Reservation" no MongoDB
export default mongoose.model<IReservation>("Reservation", ReservationSchema);