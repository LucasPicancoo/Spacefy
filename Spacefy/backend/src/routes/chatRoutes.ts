import { Router } from "express";
import { getUserConversations } from "../controllers/chatController";
import { validateAndGetTokenData } from "../middlewares/token";

const router = Router();

// Lista conversas do usuário
router.get("/conversations/:userId", validateAndGetTokenData, getUserConversations);

export default router;
