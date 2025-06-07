import { Types } from 'mongoose';

export interface IMessage {
  _id: Types.ObjectId;
  conversationId: string;
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  read?: boolean;
}

export interface IConversation {
  _id: string;
  lastMessage: IMessage;
  name: string;
  otherUserId: string;
  role: 'locatario' | 'usuario' | 'admin';
}

export interface IMessageResponse {
  message: string;
  error?: string;
} 