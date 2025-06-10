import { Request, Response } from "express";
import Conversation from "../models/Conversation";
import Message from "../models/Message";
import User from "../models/userModel";
import { Types } from "mongoose";

export const getUserConversations = async (req: Request, res: Response) => {
  const { userId } = req.params;

  // Verifica se o usuário está autenticado
  if (!req.auth) {
    res.status(401).json({ error: "Usuário não autenticado." });
    return;
  }

  // Verifica se o userId corresponde ao ID do usuário autenticado
  if (userId !== req.auth.id) {
    res.status(403).json({ error: "Você não tem permissão para ver as conversas de outro usuário." });
    return;
  }

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

export const getConversationMessages = async (req: Request, res: Response) => {
  const { conversationId } = req.params;

  // Verifica se o usuário está autenticado
  if (!req.auth) {
    res.status(401).json({ error: "Usuário não autenticado." });
    return;
  }

  try {
    // Verifica se a conversa existe e se o usuário tem permissão para acessá-la
    const conversation = await Conversation.findById(conversationId);
    
    if (!conversation) {
      res.status(404).json({ error: "Conversa não encontrada." });
      return;
    }

    if (conversation.senderId.toString() !== req.auth.id && 
        conversation.receiverId.toString() !== req.auth.id) {
      res.status(403).json({ error: "Você não tem permissão para acessar esta conversa." });
      return;
    }

    // Busca as mensagens da conversa
    const messages = await Message.find({ conversationId })
      .populate('senderId', 'name surname')
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
    return;
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error);
    res.status(500).json({ error: "Erro ao buscar mensagens da conversa." });
    return;
  }
};

export const createConversation = async (req: Request, res: Response) => {
  const { senderId, receiverId } = req.body;

  // Verifica se o usuário está autenticado
  if (!req.auth) {
    res.status(401).json({ error: "Usuário não autenticado." });
    return;
  }

  // Verifica se o senderId corresponde ao ID do usuário autenticado
  if (senderId !== req.auth.id) {
    res.status(403).json({ error: "Você não tem permissão para criar conversas como outro usuário." });
    return;
  }

  try {
    // Converter os IDs para ObjectId
    const senderObjectId = new Types.ObjectId(senderId);
    const receiverObjectId = new Types.ObjectId(receiverId);

    // Verifica se já existe uma conversa entre os usuários
    const existingConversation = await Conversation.findOne({
      $or: [
        { senderId: senderObjectId, receiverId: receiverObjectId },
        { senderId: receiverObjectId, receiverId: senderObjectId }
      ]
    });

    if (existingConversation) {
      res.status(200).json(existingConversation);
      return;
    }

    // Cria uma nova conversa
    const newConversation = await Conversation.create({
      senderId: senderObjectId,
      receiverId: receiverObjectId,
      lastMessage: "Conversa iniciada",
      read: false
    });

    res.status(201).json(newConversation);
    return;
  } catch (error) {
    console.error("Erro ao criar conversa:", error);
    res.status(500).json({ error: "Erro ao criar conversa." });
    return;
  }
};
