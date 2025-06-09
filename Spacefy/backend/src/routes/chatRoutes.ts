import { Router } from "express";
import { getUserConversations, sendMessage } from "../controllers/chatController";


const router = Router();

// Lista conversas do usuário
router.get("/conversations/:userId", getUserConversations);

// Envia mensagem
router.post("/messages", sendMessage);

export default router;
