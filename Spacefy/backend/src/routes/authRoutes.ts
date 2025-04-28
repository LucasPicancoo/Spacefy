import express from "express";
import { login, requestPasswordReset, resetPassword } from "../controllers/authController"; // certifique-se que o caminho está certo

const Loginrouter = express.Router();

// Rota de login
Loginrouter.post("/login", login as express.RequestHandler);

// Rota para solicitar recuperação de senha
Loginrouter.post("/request-password-reset", requestPasswordReset as express.RequestHandler);

// Rota para redefinir nova senha
Loginrouter.post("/reset-password", resetPassword as express.RequestHandler);

export default Loginrouter;
