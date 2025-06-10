import { Router } from "express";
import { getUserConversations, getConversationMessages, createConversation } from "../controllers/chatController";
import { validateAndGetTokenData } from "../middlewares/token";

const router = Router();

// Lista conversas do usuário
router.get("/conversations/:userId", validateAndGetTokenData, getUserConversations);

// Lista mensagens de uma conversa específica
router.get("/messages/:conversationId", validateAndGetTokenData, getConversationMessages);

// Criar uma nova conversa
router.post("/conversations", validateAndGetTokenData, createConversation);

export default router;
