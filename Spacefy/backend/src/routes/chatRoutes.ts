import { Router } from "express";
import { getUserConversations, getConversationMessages } from "../controllers/chatController";
import { validateAndGetTokenData } from "../middlewares/token";

const router = Router();

// Lista conversas do usuário
router.get("/conversations/:userId", validateAndGetTokenData, getUserConversations);

// Lista mensagens de uma conversa específica
router.get("/messages/:conversationId", validateAndGetTokenData, getConversationMessages);

export default router;
