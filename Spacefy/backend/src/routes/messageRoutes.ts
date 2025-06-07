import express from 'express';
import { validateAndGetTokenData } from '../middlewares/token';
import { messageController } from '../controllers/messageController';

const router = express.Router();

// Obter todas as mensagens de uma conversa
router.get('/conversation/:conversationId', validateAndGetTokenData, messageController.getMessagesByConversation);

// Obter todas as conversas do usuário
router.get('/conversations', validateAndGetTokenData, messageController.getUserConversations);

export default router; 