import express, { Router } from "express";
import { registerViewHistory, getViewHistoryByUser } from "../controllers/viewhistoryController";

const viewHistoryRouter: Router = express.Router();

// Rota para registrar uma visualização de espaço por usuário
viewHistoryRouter.post("/view", registerViewHistory);

// Rota para Retorna todos os espaços visualizados por um usuário
viewHistoryRouter.get("/user/:user_id", getViewHistoryByUser);

export default viewHistoryRouter;