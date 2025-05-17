import { Types } from "mongoose";

export interface IRental {
  _id?: Types.ObjectId;
  user: Types.ObjectId;      // referência ao usuário
  space: Types.ObjectId;     // referência ao espaço
  date: Date;                // data do aluguel
  startTime: string;         // horário de início (ex: "14:00")
  endTime: string;           // horário de término (ex: "16:00")
  createdAt?: Date;
  updatedAt?: Date;
}
