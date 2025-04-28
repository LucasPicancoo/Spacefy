import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Importação de todas as rotas
import userRouter from "./routes/userRoutes";
import spaceRouter from "./routes/spaceRoutes";
import authRoutes from "./routes/authRoutes"; // Inclui login e recuperação de senha
import paymentRoutes from "./routes/paymentRoutes";
import viewHistoryRouter from "./routes/viewhistoryRoutes";

dotenv.config();

const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json()); // Aceitar JSON no corpo das requisições

// Rotas
app.use("/users", userRouter); // Rotas de usuários
app.use("/spaces", spaceRouter); // Rotas de espaços
app.use("/auth", authRoutes); // Rotas de autenticação (login + recuperação de senha)
app.use("/payments", paymentRoutes); // Rotas de pagamento
app.use("/view-history", viewHistoryRouter); // Histórico de visualizações

// Configuração de porta e conexão com MongoDB
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("MONGO_URI não definida no arquivo .env");
}

app.listen(PORT, async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Banco de dados conectado!");
  } catch (error) {
    console.error("❌ Erro ao conectar no banco de dados:", error);
  }
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
