import express from "express";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  toggleFavoriteSpace,
  getUserFavorites,
  updateToLocatario,
} from "../controllers/userController";

import { validateAndGetTokenData } from "../middlewares/token";

const userRouter = express.Router();

// Rota para listar usuários
userRouter.get("/getAllUsers", validateAndGetTokenData, getAllUsers);

// Rota para criar um novo usuário
userRouter.post("/createUser", createUser);

//Rota para atualizar o usuario pelo ID
userRouter.put("/updateUser/:id", validateAndGetTokenData, updateUser);

//Rota para deletar o usuario pelo ID
userRouter.delete("/deleteUser/:id", validateAndGetTokenData, deleteUser);

//Rota para favoritar ou desfavoritar um espaço
userRouter.post("/:userId/favorite", validateAndGetTokenData, toggleFavoriteSpace);

//Rota para buscar os favoritos de um usuário
userRouter.get("/favorites/:userId", validateAndGetTokenData, getUserFavorites);

// Rota para atualizar para locatário
userRouter.put("/updateToLocatario/:id", validateAndGetTokenData, updateToLocatario);

export default userRouter;
