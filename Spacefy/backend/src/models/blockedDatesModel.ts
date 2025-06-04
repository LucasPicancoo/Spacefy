import mongoose, { Schema } from "mongoose";

// Interface para as datas bloqueadas
export interface IBlockedDates extends Document {
  space_id: mongoose.Types.ObjectId;
  blocked_dates: Date[];
}

const BlockedDatesSchema: Schema = new Schema({
  space_id: { 
    type: Schema.Types.ObjectId, 
    required: true, 
    ref: 'Space' 
  },
  blocked_dates: [{ 
    type: Date, 
    required: true 
  }]
});

// Adiciona índice composto único
BlockedDatesSchema.index({ space_id: 1 }, { unique: true });

export default mongoose.model<IBlockedDates>("BlockedDates", BlockedDatesSchema); 