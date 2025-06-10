import { Schema, model, Document } from "mongoose";

export interface IMessage extends Document {
  conversationId: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    conversationId: { type: String, required: true },
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, required: true, default: () => new Date() },
  },
  {
    timestamps: false,
  }
);

const Message = model<IMessage>("Message", messageSchema);
export default Message;
