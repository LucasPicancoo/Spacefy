import express from "express";
import { getAllUsers, createUser } from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/", getAllUsers); // Rota para listar usuários
userRouter.post("/", createUser); // Rota para criar um novo usuário

export default userRouter;
