import express from "express";
import { login } from "../controllers/authController"; // certifique-se que o caminho está certo

const Loginrouter = express.Router();

// Rota de login
Loginrouter.post("/login", login as express.RequestHandler);

export default Loginrouter;
