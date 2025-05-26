import express from "express";
import { blockDate, getBlockedDatesBySpace, unblockDate } from "../controllers/blockedDateController";
import { validateAndGetTokenData } from "../middlewares/token";

const router = express.Router();

router.post("/", validateAndGetTokenData, blockDate); // Bloquear nova data
router.get("/:spaceId", getBlockedDatesBySpace); // Listar datas bloqueadas de um espaço
router.delete("/", validateAndGetTokenData, unblockDate); // Desbloquear data

export default router;
