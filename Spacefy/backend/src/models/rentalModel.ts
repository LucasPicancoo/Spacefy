import mongoose, { Schema, Document, Types } from "mongoose";

export interface IRental extends Document {
  user: Types.ObjectId;
  space: Types.ObjectId;
  date: Date;
  startTime: string;
  endTime: string;
}

const rentalSchema = new Schema<IRental>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    space: {
      type: Schema.Types.ObjectId,
      ref: "Space",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
      match: /^([0-1]\d|2[0-3]):([0-5]\d)$/, // formato HH:MM
    },
    endTime: {
      type: String,
      required: true,
      match: /^([0-1]\d|2[0-3]):([0-5]\d)$/, // formato HH:MM
    },
  },
  {
    timestamps: true,
  }
);

const RentalModel = mongoose.model<IRental>("Rental", rentalSchema);

export default RentalModel;
