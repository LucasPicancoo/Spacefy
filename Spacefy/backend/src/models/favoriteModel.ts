import mongoose, { Schema, model } from "mongoose";
import { IFavorite } from "../types/favorite";

const FavoriteSchema: Schema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  spaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Space",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Índice composto para garantir que um usuário não possa favoritar o mesmo espaço mais de uma vez
FavoriteSchema.index({ userId: 1, spaceId: 1 }, { unique: true });

const FavoriteModel = model<IFavorite>("favorite", FavoriteSchema);
export default FavoriteModel; 