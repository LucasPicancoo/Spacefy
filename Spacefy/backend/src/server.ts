// server.ts - Configuração do servidor Express
import express from "express";
import db from "./config/database";
import routes from "./routes";
import authRoutes from "./routes/authRoutes";

const app = express();
app.use(express.json()); // Middleware para JSON
app.use("/api", routes); // Rotas principais da API
app.use("/auth", authRoutes); // Rotas de autenticação

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  try {
    await db.authenticate(); // Conexão com o banco de dados
    console.log("Banco de dados conectado!");
  } catch (error) {
    console.error("Erro ao conectar no banco de dados:", error);
  }
  console.log(`Servidor rodando na porta ${PORT}`);
});
