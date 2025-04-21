import mongoose, { Schema } from "mongoose";

const ViewHistorySchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true }, // ID do usuário
    space_id: { type: Schema.Types.ObjectId, ref: "Space", required: true }, // ID do espaço
    viewed_at: { type: Date, default: Date.now }, // Data e hora da visualização
  },
  { timestamps: true }
);

export default mongoose.model("ViewHistory", ViewHistorySchema);
