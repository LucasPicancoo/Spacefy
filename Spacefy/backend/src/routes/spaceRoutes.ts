import express from "express";
import {
  getAllSpaces,
  getSpaceById,
  createSpace,
  updateSpace,
  deleteSpace,
} from "../controllers/spaceController";
import { validateAndGetTokenData } from "../middlewares/token";

const spaceRouter = express.Router();

// Rota para listar todos os espaços
spaceRouter.get("/getAllSpaces", validateAndGetTokenData, getAllSpaces);

// Rota para obter um espaço por ID
spaceRouter.get("/getSpaceById/:id", validateAndGetTokenData, getSpaceById);

// Rota para criar um novo espaço
spaceRouter.post("/createSpace", validateAndGetTokenData, createSpace);

// Rota para atualizar um espaço por ID
spaceRouter.put("/updateSpace", validateAndGetTokenData, updateSpace);

// Rota para excluir um espaço por ID
spaceRouter.delete("/deleteSpace", validateAndGetTokenData, deleteSpace);

export default spaceRouter;
