import { Request, Response } from 'express';
import NotificationModel from '../models/notificationModel';
import UserModel from '../models/userModel';
import mongoose from 'mongoose';
import { sendEmail } from '../services/sendEmail';

// 🔥 Criar notificação (com envio de email)
export const createNotification = async (userId: string, title: string, message: string) => {
  const notification = await NotificationModel.create({
    user: userId,
    title,
    message,
  });

  const user = await UserModel.findById(userId);

  if (user && user.email) {
    await sendEmail(
      user.email,
      title,
      message
    );
  }

  return notification;
};

// 🔥 Listar notificações do usuário (com opção de filtrar só não lidas)
export const getUserNotifications = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { unreadOnly } = req.query;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'ID de usuário inválido.' });
    }

    const filter: any = { user: userId };
    if (unreadOnly === 'true') {
      filter.isRead = false;
    }

    const notifications = await NotificationModel.find(filter).sort({ createdAt: -1 });

    return res.status(200).json(notifications);
  } catch (error) {
    console.error('Erro ao buscar notificações:', error);
    return res.status(500).json({ error: 'Erro interno ao buscar notificações.' });
  }
};

// 🔥 Marcar notificação como lida
export const markNotificationAsRead = async (req: Request, res: Response) => {
  try {
    const { notificationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      return res.status(400).json({ error: 'ID de notificação inválido.' });
    }

    const notification = await NotificationModel.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: 'Notificação não encontrada.' });
    }

    return res.status(200).json(notification);
  } catch (error) {
    console.error('Erro ao atualizar notificação:', error);
    return res.status(500).json({ error: 'Erro interno ao atualizar notificação.' });
  }
};

// 🔥 Deletar notificação
export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const { notificationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      return res.status(400).json({ error: 'ID de notificação inválido.' });
    }

    const notification = await NotificationModel.findByIdAndDelete(notificationId);

    if (!notification) {
      return res.status(404).json({ error: 'Notificação não encontrada.' });
    }

    return res.status(200).json({ message: 'Notificação deletada com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar notificação:', error);
    return res.status(500).json({ error: 'Erro interno ao deletar notificação.' });
  }
};
