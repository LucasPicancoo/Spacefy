import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import userRouter from "./routes/userRoutes";
import spaceRouter from "./routes/spaceRoutes";
import authRoutes from "./routes/authRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import viewHistoryRouter from "./routes/viewhistoryRoutes";
import rentalRoutes from "./routes/rentalRoutes"; 
import assessmentRoutes from "./routes/assessmentRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import blockedDatesRouter from "./routes/blockedDatesRoutes";
import openaiRoutes from "./routes/openaiRoutes";

dotenv.config();

const app = express();

// Configuração do Rate Limiter
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 150, // limite de 100 requisições por IP
  message: {
    error: "Muitas requisições deste IP, por favor tente novamente após 1 minuto"
  },
  standardHeaders: true, // Retorna rate limit info nos headers `RateLimit-*`
  legacyHeaders: false, // Desabilita os headers `X-RateLimit-*`
});

// Configuração do CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:8081' || 'http://localhost:5173', // URL do frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 horas
};

// Middlewares de segurança
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(limiter); // Aplicar rate limiting globalmente

// Rotas
app.use("/users", userRouter);
app.use("/spaces", spaceRouter);
app.use("/auth", authRoutes);
app.use("/payments", paymentRoutes);
app.use("/view-history", viewHistoryRouter);
app.use("/rentals", rentalRoutes); 
app.use("/assessment", assessmentRoutes);
app.use("/notifications", notificationRoutes);
app.use("/blocked-dates", blockedDatesRouter);
app.use("/openai", openaiRoutes);

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