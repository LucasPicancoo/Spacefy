import express from "express";
import { getAllUsers, createUser } from "../controllers/userController";

const userRouter = express.Router();

// Rota para listar usuários
userRouter.get("/getAllUsers", getAllUsers); 

// Rota para criar um novo usuário
userRouter.post("/createUser", createUser); 

export default userRouter;
