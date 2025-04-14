import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/userRoutes";
import authRouter from "./routes/authRoutes"; // Importa as rotas de autenticação (ainda não implementadas)

dotenv.config();

const app = express();
app.use(express.json()); // Middleware para JSON
app.use("/users", userRouter); // Rotas de usuários
app.use("/auth", authRouter); // Rotas de autenticação (ainda não implementadas)

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("MONGO_URI não definida no arquivo .env");
}

app.listen(PORT, async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Banco de dados conectado!");
  } catch (error) {
    console.error("Erro ao conectar no banco de dados:", error);
  }
  console.log(`Servidor rodando na porta ${PORT}`);
});
