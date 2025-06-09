import { Router } from "express";
import { handleChatRequest } from "../controllers/openaiController";

const router = Router();

router.post("/processar-pesquisa", handleChatRequest);

export default router;
