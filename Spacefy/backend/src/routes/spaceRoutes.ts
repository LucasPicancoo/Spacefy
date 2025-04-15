import express from "express";
import {
  getAllSpaces,
  getSpaceById,
  createSpace,
  updateSpace,
  deleteSpace,
} from "../controllers/spaceController";

const router = express.Router();

// Rota para listar todos os espaços
router.get("/spaces", getAllSpaces);

// Rota para obter um espaço por ID
router.get("/spaces/:id", getSpaceById);

// Rota para criar um novo espaço
router.post("/spaces", createSpace);

// Rota para atualizar um espaço por ID
router.put("/spaces/:id", updateSpace);

// Rota para excluir um espaço por ID
router.delete("/spaces/:id", deleteSpace);

export default router;