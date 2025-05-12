import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  spaceId: string;
  userId: string;
  comment: string;
  assessment_id?: string;
  isEdited?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const CommentSchema: Schema = new Schema(
  {
    spaceId: {
      type: String,
      required: [true, "spaceId é obrigatório"],
    },
    userId: {
      type: String,
      required: [true, "userId é obrigatório"],
    },
    text: {
      // Nome alterado de 'comment' para 'text'
      type: String,
      required: [true, "Texto do comentário é obrigatório"],
      trim: true,
      minlength: [2, "Comentário deve ter no mínimo 2 caracteres"],
      maxlength: [500, "Comentário deve ter no máximo 500 caracteres"],
      validate: {
        validator: (v: string) => v.trim().length >= 2,
        message: "Comentário não pode ser apenas espaços em branco",
      },
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Cria automaticamente createdAt e updatedAt
  }
);

// Adiciona índices para otimizar consultas
CommentSchema.index({ spaceId: 1, userId: 1 });

// Validação adicional (opcional)
CommentSchema.path("comment").validate(function (value: string) {
  return value.trim().length >= 2 && value.trim().length <= 500;
}, "O comentário deve ter entre 2 e 500 caracteres.");

const Comment = mongoose.model<IComment>("Comment", CommentSchema);
export default Comment;
