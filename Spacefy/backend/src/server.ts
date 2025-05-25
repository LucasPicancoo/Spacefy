import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser"; // Importar cookie-parser

import userRouter from "./routes/userRoutes";
import spaceRouter from "./routes/spaceRoutes";
import authRoutes from "./routes/authRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import viewHistoryRouter from "./routes/viewhistoryRoutes";
import rentalRoutes from "./routes/rentalRoutes"; // ✅ Importação adicionada
import assessmentRoutes from "./routes/assessmentRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser()); // Adicionar o middleware para cookies

// Rotas
app.use("/users", userRouter);
app.use("/spaces", spaceRouter);
app.use("/auth", authRoutes);
app.use("/payments", paymentRoutes);
app.use("/view-history", viewHistoryRouter);
app.use("/rentals", rentalRoutes); // ✅ Rota de aluguéis adicionada
app.use("/assessment", assessmentRoutes);

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
