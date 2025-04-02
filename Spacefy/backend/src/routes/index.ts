// routes/index.ts - Definição das rotas da API
import express from "express";
import * as spaceController from "../controllers/spaceController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/spaces", spaceController.getAllSpaces); // Rota para listar espaços
router.get("/spaces/:id", spaceController.getSpaceById); // Rota para buscar um espaço pelo ID
router.post("/spaces", authMiddleware, spaceController.createSpace); // Rota protegida para criar espaço

export default router;
