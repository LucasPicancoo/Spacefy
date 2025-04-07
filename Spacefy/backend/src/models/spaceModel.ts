// models/Space.ts - Modelo da entidade "Space"
import mongoose, { Schema, Document } from "mongoose";

export interface ISpace extends Document {
  name: string;
  category: string;
  location: string;
  price: number;
  capacity: number;
  description?: string;
  ownerId: string;
}

const SpaceSchema: Schema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  capacity: { type: Number, required: true },
  description: { type: String },
  ownerId: { type: String, required: true },
});

export default mongoose.model<ISpace>("Space", SpaceSchema);
