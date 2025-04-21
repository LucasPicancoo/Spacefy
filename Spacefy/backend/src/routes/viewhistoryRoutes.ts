import express from "express";
import { registerViewHistory, getViewHistoryByUser } from "../controllers/viewhistoryController";

const viewHistoryRouter = express.Router();

// Rota para registrar uma visualização de espaço por usuário
viewHistoryRouter.post("/register", registerViewHistory);

// Rota para Retorna todos os espaços visualizados por um usuário
viewHistoryRouter.get("/user/:user_id", getViewHistoryByUser);

export default viewHistoryRouter;
