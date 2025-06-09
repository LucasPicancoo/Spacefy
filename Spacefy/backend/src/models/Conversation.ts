import { Schema, model, Document } from "mongoose";

export interface IConversation extends Document {
  senderId: string;
  receiverId: string;
  lastMessage: string;
  read: boolean;
  updatedAt: Date;
  createdAt: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    lastMessage: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  {
    timestamps: true, // createdAt e updatedAt automáticos
  }
);

const Conversation = model<IConversation>("Conversation", conversationSchema);
export default Conversation;
