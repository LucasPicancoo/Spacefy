import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import { validateAndGetTokenData } from "./middlewares/token";
import { AuthenticationData } from "./types/auth";
import jwt from "jsonwebtoken";

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
import chatRoutes from "./routes/chatRoutes";
import Conversation from "./models/Conversation";
import Message from "./models/Message";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Configuração do Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 9999999, // limite de 250 requisições por IP
  message: {
    error: "Muitas requisições deste IP, por favor tente novamente após 15 minutos"
  },
  standardHeaders: true, // Retorna rate limit info nos headers `RateLimit-*`
  legacyHeaders: false, // Desabilita os headers `X-RateLimit-*`
});

// Configuração do CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // URL do frontend
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

// Middleware para expor o io nas rotas
app.use((req, res, next) => {
  (req as any).io = io;
  next();
});

// Middleware de autenticação para Socket.IO usando o validateAndGetTokenData
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    return next(new Error("Token não fornecido"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY as string) as AuthenticationData;
    socket.data.user = decoded;
    next();
  } catch (error) {
    return next(new Error("Token inválido"));
  }
});

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
app.use("/chat", chatRoutes);
app.use("/openai", openaiRoutes);

io.on("connection", (socket) => {
  console.log("Usuário conectado:", socket.id);
  const userId = socket.data.user.id;
  console.log("ID do usuário autenticado:", userId);

  socket.on("join", (roomId) => {
    console.log(`Usuário ${userId} entrou na sala ${roomId}`);
    socket.join(roomId);
  });

  socket.on("send_message", async (data: { senderId: string; receiverId: string; message: string }) => {
    const { senderId, receiverId, message } = data;
    console.log("Tentando enviar mensagem:", { senderId, receiverId, message });

    // Verifica se o usuário autenticado é o remetente
    if (senderId !== userId) {
      console.log("Erro: Usuário não autorizado a enviar mensagem como outro usuário");
      socket.emit("error", { message: "Você não tem permissão para enviar mensagens como outro usuário." });
      return;
    }

    // Validação dos dados
    if (!senderId || !receiverId || !message) {
      console.log("Erro: Dados incompletos para enviar mensagem");
      socket.emit("error", { message: "Dados incompletos para enviar mensagem." });
      return;
    }

    try {
      let conversation = await Conversation.findOne({
        $or: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId }
        ]
      });

      if (!conversation) {
        console.log("Criando nova conversa");
        conversation = await Conversation.create({
          senderId,
          receiverId,
          lastMessage: message,
          read: false
        });
      } else {
        console.log("Atualizando conversa existente");
        conversation.lastMessage = message;
        conversation.read = false;
        await conversation.save();
      }

      const newMessage = await Message.create({
        conversationId: conversation._id,
        senderId,
        receiverId,
        message,
        timestamp: new Date()
      });

      console.log("Mensagem criada:", newMessage);
      console.log("Emitindo mensagem para:", receiverId);
      
      // Emitir para a sala do destinatário
      io.to(receiverId).emit("receive_message", newMessage);
      console.log("Mensagem emitida com sucesso");
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      socket.emit("error", { message: "Erro ao enviar mensagem." });
    }
  });

  socket.on("disconnect", () => {
    console.log("Usuário desconectado:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("MONGO_URI não definida no arquivo .env");
}

server.listen(PORT, async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Banco de dados conectado!");
  } catch (error) {
    console.error("Erro ao conectar no banco de dados:", error);
  }
  console.log(`Servidor rodando na porta ${PORT}`);
});