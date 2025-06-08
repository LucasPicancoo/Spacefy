import { Router } from "express";
import { handleChatRequest } from "../controllers/openAiController";

const router = Router();

router.post("/processar-pesquisa", async (req, res) => {
  await handleChatRequest(req, res);
});

export default router;
