import { Document, Types } from "mongoose"; // 👈 Importe explicitamente

export interface IComment extends Document {
  text: string;
  user_id: string;
  space_id: string;
  assessment_id?: boolean; // Se o comentário está associado a alguma avaliação (acredito que seja boolean)
  createdAt?: Date;
  updatedAt?: Date;
}
