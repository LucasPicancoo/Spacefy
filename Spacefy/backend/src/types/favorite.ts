import { Document } from "mongoose";
import mongoose from "mongoose";

// Interface base para favoritos
export interface IFavorite extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  spaceId: mongoose.Types.ObjectId;
  createdAt: Date;
}

// Interface para resposta populada (quando buscamos os favoritos com os dados do espaço)
export interface IPopulatedFavorite extends Omit<IFavorite, 'spaceId'> {
  spaceId: {
    _id: mongoose.Types.ObjectId;
    name: string;
    description: string;
    images: string[];
  };
} 