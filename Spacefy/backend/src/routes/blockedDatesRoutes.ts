import express from "express";
import {
  createOrUpdateBlockedDates,
  getBlockedDatesBySpaceId
} from "../controllers/blockedDatesController";
import { validateAndGetTokenData } from "../middlewares/token";

const blockedDatesRouter = express.Router();

// Rota para criar ou atualizar datas bloqueadas
blockedDatesRouter.post("/createOrUpdate", validateAndGetTokenData, createOrUpdateBlockedDates);

// Rota para obter datas bloqueadas por ID do espaço
blockedDatesRouter.get("/getBySpaceId/:space_id", getBlockedDatesBySpaceId);

export default blockedDatesRouter; 