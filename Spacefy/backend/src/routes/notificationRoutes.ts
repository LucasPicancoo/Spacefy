import express from "express";
import { 
  getUserNotifications,
  markNotificationAsRead,
  deleteNotification
} from "../controllers/notificationController";

const router = express.Router();

// Listar notificações do usuário (com filtro opcional unreadOnly)
router.get("/user/:userId", getUserNotifications);

// Marcar notificação como lida
router.patch("/:notificationId/read", markNotificationAsRead);

// Deletar notificação
router.delete("/:notificationId", deleteNotification);

export default router;
