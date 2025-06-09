import { Request, Response } from "express";
import Conversation from "../models/Conversation";
import Message from "../models/Message";
import User from "../models/userModel";

export const getUserConversations = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const conversations = await Conversation.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    })
    .populate('senderId', 'name surname')
    .populate('receiverId', 'name surname')
    .sort({ updatedAt: -1 });

    res.status(200).json(conversations);
    return;
  } catch (error) {
    console.error("Erro ao buscar conversas:", error);
    res.status(500).json({ error: "Erro ao buscar conversas." });
    return;
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  const { senderId, receiverId, message } = req.body;

  if (!senderId || !receiverId || !message) {
    res.status(400).json({ error: "Dados incompletos para enviar mensagem." });
    return;
  }

  try {
    let conversation = await Conversation.findOne({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    });

    if (!conversation) {
      conversation = await Conversation.create({
        senderId,
        receiverId,
        lastMessage: message,
        read: false,
      });
    } else {
      conversation.lastMessage = message;
      conversation.read = false;
      await conversation.save();
    }

    const newMessage = await Message.create({
      conversationId: conversation._id,
      senderId,
      receiverId,
      message,
      timestamp: new Date(),
    });

    const io = (req as any).io;
    if (io) {
      io.to(receiverId).emit("receive_message", newMessage);
    }

    res.status(201).json(newMessage);
    return;
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    res.status(500).json({ error: "Erro ao enviar mensagem." });
    return;
  }
};
