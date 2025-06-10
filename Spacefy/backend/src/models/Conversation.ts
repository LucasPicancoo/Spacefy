import { Schema, model, Document, Types } from "mongoose";

export interface IConversation extends Document {
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  lastMessage: string;
  read: boolean;
  updatedAt: Date;
  createdAt: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
    senderId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    lastMessage: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  {
    timestamps: true, // createdAt e updatedAt automáticos
  }
);

const Conversation = model<IConversation>("Conversation", conversationSchema);
export default Conversation;
