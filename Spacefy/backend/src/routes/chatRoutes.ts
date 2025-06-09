import { Router } from "express";
import { getUserConversations, sendMessage } from "../controllers/chatController";
import { validateAndGetTokenData } from "../middlewares/token";


const router = Router();

// Lista conversas do usuário
router.get("/conversations/:userId", validateAndGetTokenData, getUserConversations);

// Envia mensagem
router.post("/messages", validateAndGetTokenData, sendMessage);

export default router;
