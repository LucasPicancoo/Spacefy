import express from "express";
import {
  getAllSpaces,
  getSpaceById,
  createSpace,
  updateSpace,
  deleteSpace,
  getSpacesWithFilters,
  getSpacesByExperienceAmenities,
  getSpacesByOwnerId,
} from "../controllers/spaceController";
import { validateAndGetTokenData } from "../middlewares/token";

const spaceRouter = express.Router();

// Rota para listar todos os espaços
spaceRouter.get("/getAllSpaces", getAllSpaces);

// Rota para obter um espaço por ID
spaceRouter.get("/getSpaceById/:id", getSpaceById);

// Rota para buscar espaços com filtros
spaceRouter.get("/getSpacesWithFilters", getSpacesWithFilters);

// Rota para criar um novo espaço
spaceRouter.post("/createSpace", validateAndGetTokenData, createSpace);

// Rota para atualizar um espaço por ID
spaceRouter.put("/updateSpace/:id", validateAndGetTokenData, updateSpace);

// Rota para excluir um espaço por ID
spaceRouter.delete("/deleteSpace/:id", validateAndGetTokenData, deleteSpace);

// Rota para buscar espaços por comodidades da tela de experiência
spaceRouter.get("/getSpacesByExperienceAmenities", getSpacesByExperienceAmenities);

// Rota para buscar espaços por ID do proprietário
spaceRouter.get("/getSpacesByOwnerId/:owner_id", getSpacesByOwnerId);

export default spaceRouter;
