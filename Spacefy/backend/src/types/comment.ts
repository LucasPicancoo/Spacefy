import { Document, Types } from "mongoose"; // 👈 Importe explicitamente

export interface IComment extends Document {
  text: string;
  user_id: Types.ObjectId; // 👈 Usando o tipo importado
  space_id: Types.ObjectId;
  assessment_id?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
