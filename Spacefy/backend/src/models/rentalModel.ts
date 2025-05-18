import mongoose, { Schema, Document, Types } from "mongoose";

export interface IRental extends Document {
  user: Types.ObjectId;
  space: Types.ObjectId;
  start_date: Date;
  end_date: Date;
  startTime: string;
  endTime: string;
  value: number;
}

const rentalSchema = new Schema<IRental>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "O usuário é obrigatório"],
    },
    space: {
      type: Schema.Types.ObjectId,
      ref: "Space",
      required: [true, "O espaço é obrigatório"],
    },
    start_date: {
      type: Date,
      required: [true, "A data de início é obrigatória"],
      validate: {
        validator: function(value: Date) {
          return value >= new Date(new Date().setHours(0, 0, 0, 0));
        },
        message: "A data de início não pode ser anterior ao dia atual"
      }
    },
    end_date: {
      type: Date,
      required: [true, "A data de término é obrigatória"],
      validate: {
        validator: function(this: IRental, value: Date) {
          return value >= this.start_date;
        },
        message: "A data de término deve ser igual ou posterior à data de início"
      }
    },
    startTime: {
      type: String,
      required: [true, "O horário de início é obrigatório"],
      match: [/^([0-1]\d|2[0-3]):([0-5]\d)$/, "Formato de horário inválido (HH:MM)"],
    },
    endTime: {
      type: String,
      required: [true, "O horário de término é obrigatório"],
      match: [/^([0-1]\d|2[0-3]):([0-5]\d)$/, "Formato de horário inválido (HH:MM)"],
      validate: {
        validator: function(this: IRental, value: string) {
          if (this.start_date.getTime() === this.end_date.getTime()) {
            return value > this.startTime;
          }
          return true;
        },
        message: "O horário de término deve ser posterior ao horário de início quando for o mesmo dia"
      }
    },
    value: {
      type: Number,
      required: [true, "O valor é obrigatório"],
      min: [0, "O valor não pode ser negativo"],
      validate: {
        validator: function(value: number) {
          return Number.isFinite(value) && value > 0;
        },
        message: "O valor deve ser um número positivo"
      }
    }
  },
  {
    timestamps: true
  }
);

// Índices para melhorar a performance das consultas
rentalSchema.index({ space: 1, start_date: 1, end_date: 1 });
rentalSchema.index({ user: 1 });
rentalSchema.index({ start_date: 1, end_date: 1 });

const RentalModel = mongoose.model<IRental>("Rental", rentalSchema);

export default RentalModel;
