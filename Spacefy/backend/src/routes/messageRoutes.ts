import express, { Request } from 'express';
import { validateAndGetTokenData } from '../middlewares/token';
import Message from '../models/Message';

const router = express.Router();

// Interface para Request com usuário
interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    role: "locatario" | "usuario";
  };
}

// Obter todas as mensagens de uma conversa
router.get('/conversation/:conversationId', validateAndGetTokenData, async (req: AuthenticatedRequest, res) => {
  try {
    const messages = await Message.find({ conversationId: req.params.conversationId })
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar mensagens' });
  }
});

// Obter todas as conversas do usuário
router.get('/conversations', validateAndGetTokenData, async (req: AuthenticatedRequest, res) => {
  try {
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { senderId: req.user?.id },
            { receiverId: req.user?.id }
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
      }
    ]);
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar conversas' });
  }
});

export default router; 