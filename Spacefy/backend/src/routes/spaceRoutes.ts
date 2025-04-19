import express from "express";
import {
  getAllSpaces,
  getSpaceById,
  createSpace,
  updateSpace,
  deleteSpace,
} from "../controllers/spaceController";

const spaceRouter = express.Router();

// Rota para listar todos os espaços
spaceRouter.get("/getAllSpaces", getAllSpaces);

// Rota para obter um espaço por ID
spaceRouter.get("/getSpaceById", getSpaceById);

// Rota para criar um novo espaço
spaceRouter.post("/createSpace", createSpace);

// Rota para atualizar um espaço por ID
spaceRouter.put("/updateSpace", updateSpace);

// Rota para excluir um espaço por ID
spaceRouter.delete("/deleteSpace", deleteSpace);

export default spaceRouter;