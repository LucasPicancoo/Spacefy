// models/blockedDateModel.ts
import mongoose, { Schema, Document, Types } from "mongoose";

export interface IBlockedDate extends Document {
  space: Types.ObjectId;
  date: Date;
  reason?: string;
}

const blockedDateSchema = new Schema<IBlockedDate>(
  {
    space: { type: Schema.Types.ObjectId, ref: "Space", required: true },
    date: { type: Date, required: true },
    reason: { type: String },
  },
  { timestamps: true }
);

// Impede duplicidade de datas bloqueadas por espaço
blockedDateSchema.index({ space: 1, date: 1 }, { unique: true });

const BlockedDateModel = mongoose.model<IBlockedDate>("BlockedDate", blockedDateSchema);
export default BlockedDateModel;
