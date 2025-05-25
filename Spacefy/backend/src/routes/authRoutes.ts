import express from "express";
import { login } from "../controllers/authController"; // certifique-se que o caminho está certo
import { getCookie, deleteCookie } from "../controllers/authController";

const Loginrouter = express.Router();

// Rota de login
Loginrouter.post("/login", login as express.RequestHandler);

// Rotas para gerenciamento de cookies
Loginrouter.get("/get-cookie", getCookie as express.RequestHandler); // Lê um cookie
Loginrouter.get("/delete-cookie", deleteCookie as express.RequestHandler); // Remove um cookie

export default Loginrouter;
