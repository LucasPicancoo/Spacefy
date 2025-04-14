import express from 'express';
import { LoginController } from '../controllers/loginController';

const authRoutes = express.Router();
const loginController = new LoginController(); // Cria a instância

// Adiciona um manipulador assíncrono para o login
authRoutes.post('/login', async (req, res) => {
  await loginController.login(req, res);
});

export default authRoutes;
