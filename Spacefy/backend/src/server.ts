import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
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
import messageRoutes from "./routes/messageRoutes";
import Message from "./models/Message";
import openaiRoutes from "./routes/openaiRoutes";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
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
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // URL do frontend
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
app.use("/messages", messageRoutes);
app.use("/chat", openaiRoutes);

// Interface para o Socket com usuário
interface AuthenticatedSocket extends Socket {
  user?: {
    id: string;
    role: string;
  };
}

// Socket.IO middleware para autenticação
io.use((socket: AuthenticatedSocket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    console.log('Token não fornecido');
    return next(new Error('Autenticação necessária'));
  }

  try {
    // Remover 'Bearer ' se existir
    const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token;
    
    const decoded = jwt.verify(cleanToken, process.env.JWT_KEY || 'seu_jwt_secret') as { 
      id: string; 
      role: string;
      name: string;
      surname: string;
      email: string;
    };
    
    socket.user = {
      id: decoded.id,
      role: decoded.role
    };
    
    next();
  } catch (err) {
    next(new Error('Token inválido'));
  }
});

// Lógica do Socket.IO
io.on('connection', (socket: AuthenticatedSocket) => {
  // Entrar em uma sala de conversa
  socket.on('join_conversation', (conversationId) => {
    socket.join(conversationId);
  });

  // Enviar mensagem
  socket.on('send_message', async (data) => {
    try {
      const { conversationId, receiverId, content } = data;
      
      if (!receiverId) {
        throw new Error('ID do destinatário é obrigatório');
      }

      const message = new Message({
        conversationId,
        senderId: socket.user?.id,
        receiverId: new mongoose.Types.ObjectId(receiverId),
        content
      });

      await message.save();

      // Enviar mensagem para todos na sala
      io.to(conversationId).emit('new_message', message);
    } catch (error: any) {
      socket.emit('message_error', { error: error.message });
    }
  });

  // Marcar mensagem como lida
  socket.on('mark_as_read', async (messageId) => {
    try {
      await Message.findByIdAndUpdate(messageId, { read: true });
      socket.emit('message_read', messageId);
    } catch (error) {
      console.error('Erro ao marcar mensagem como lida:', error);
    }
  });
});

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("MONGO_URI não definida no arquivo .env");
}

httpServer.listen(PORT, async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Banco de dados conectado!");
  } catch (error) {
    console.error("Erro ao conectar no banco de dados:", error);
  }
  console.log(`Servidor rodando na porta ${PORT}`);
});