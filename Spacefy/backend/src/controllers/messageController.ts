import { Request, Response } from 'express';
import Message from '../models/Message';
import User from '../models/userModel';
import { Types } from 'mongoose';
import { IMessage, IConversation, IMessageResponse } from '../types/message';

interface AuthenticatedRequest extends Request {
  auth?: {
    id: string;
    role: "locatario" | "usuario" | "admin";
  };
}

export const messageController = {
  // Obter todas as mensagens de uma conversa
  async getMessagesByConversation(req: AuthenticatedRequest, res: Response<IMessage[] | IMessageResponse>) {
    try {
      const messages = await Message.find({ conversationId: req.params.conversationId })
        .sort({ createdAt: 1 });
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar mensagens' });
    }
  },

  // Obter todas as conversas do usuário
  async getUserConversations(req: AuthenticatedRequest, res: Response<IConversation[] | IMessageResponse>) {
    try {
      const userMessages = await Message.find({
        $or: [
          { senderId: req.auth?.id },
          { receiverId: req.auth?.id }
        ]
      });

      const conversations = await Message.aggregate([
        {
          $match: {
            $or: [
              { senderId: req.auth?.id },
              { receiverId: req.auth?.id }
            ]
          }
        },
        {
          $sort: { createdAt: -1 }
        },
        {
          $group: {
            _id: '$conversationId',
            lastMessage: { $first: '$$ROOT' }
          }
        },
        {
          $lookup: {
            from: 'users',
            let: { 
              senderId: '$lastMessage.senderId',
              receiverId: '$lastMessage.receiverId'
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $or: [
                      { $eq: ['$_id', { $toObjectId: '$$senderId' }] },
                      { $eq: ['$_id', { $toObjectId: '$$receiverId' }] }
                    ]
                  }
                }
              },
              {
                $project: {
                  _id: 1,
                  name: { $concat: ['$name', ' ', '$surname'] },
                  role: 1
                }
              }
            ],
            as: 'participants'
          }
        },
        {
          $addFields: {
            otherUser: {
              $filter: {
                input: '$participants',
                as: 'participant',
                cond: { $ne: ['$$participant._id', { $toObjectId: req.auth?.id }] }
              }
            }
          }
        },
        {
          $addFields: {
            name: { $arrayElemAt: ['$otherUser.name', 0] },
            otherUserId: { $arrayElemAt: ['$otherUser._id', 0] },
            role: { $arrayElemAt: ['$otherUser.role', 0] }
          }
        },
        {
          $project: {
            _id: 1,
            lastMessage: 1,
            name: 1,
            otherUserId: 1,
            role: 1
          }
        }
      ]);

      // Se não houver conversas, vamos criar uma conversa a partir das mensagens existentes
      if (conversations.length === 0 && userMessages.length > 0) {
        const conversation = {
          _id: userMessages[0].conversationId,
          lastMessage: userMessages[0],
          name: 'Usuário', // Nome temporário
          otherUserId: userMessages[0].senderId.toString() === req.auth?.id ? userMessages[0].receiverId : userMessages[0].senderId,
          role: 'usuario' // Role temporária
        };
        conversations.push(conversation);
      }

      res.json(conversations);
    } catch (error: any) {
      console.error('Erro ao buscar conversas:', error);
      res.status(500).json({ message: 'Erro ao buscar conversas', error: error.message });
    }
  }
}; 