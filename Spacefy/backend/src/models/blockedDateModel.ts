import mongoose, { Schema, Document, Types } from "mongoose";

export interface IBlockedDate extends Document {
  space: Types.ObjectId;
  date: Date;
  reason?: string;
}

const blockedDateSchema = new Schema<IBlockedDate>(
  {
    space: { type: Schema.Types.ObjectId, ref: "Space", required: true },
    date: {
      type: Date,
      required: true,
      validate: {
        validator: (value: Date) => value >= new Date(new Date().setUTCHours(0, 0, 0, 0)),
        message: "A data não pode estar no passado."
      }
    },
    reason: {
      type: String,
      maxlength: 200
    }
  },
  { timestamps: true }
);

// Impede duplicidade de datas bloqueadas por espaço
blockedDateSchema.index({ space: 1, date: 1 }, { unique: true });

// Limpa o retorno do JSON
blockedDateSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
  }
});

const BlockedDateModel = mongoose.model<IBlockedDate>("BlockedDate", blockedDateSchema);
export default BlockedDateModel;
