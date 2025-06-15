import { Request, Response } from 'express';
import NotificationModel from '../models/notificationModel';
import UserModel from '../models/userModel';
import mongoose from 'mongoose';
import { sendEmail } from '../services/sendEmail';

export const createNotification = async (userId: string, title: string, message: string) => {
  const notification = await NotificationModel.create({
    user: userId,
    title,
    message,
  });

  const user = await UserModel.findById(userId);

  if (user && user.email) {
    console.log(`Tentando enviar email para: ${user.email}`);  // <-- log antes do envio

    try {
      await sendEmail(user.email, title, message);
      console.log(`Email enviado com sucesso para: ${user.email}`);  // <-- log após sucesso
    } catch (error) {
      console.error(`Erro ao enviar email para ${user.email}:`, error);  // <-- log erro
    }
  } else {
    console.log('Usuário não encontrado ou sem email para envio.');
  }

  return notification;
};

// Outras funções continuam iguais...

export const getUserNotifications = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { unreadOnly } = req.query;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ error: 'ID de usuário inválido.' });
      return;
    }

    const filter: any = { user: userId };
    if (unreadOnly === 'true') {
      filter.isRead = false;
    }

    const notifications = await NotificationModel.find(filter).sort({ createdAt: -1 });

    res.status(200).json(notifications);
    return;
  } catch (error) {
    console.error('Erro ao buscar notificações:', error);
    res.status(500).json({ error: 'Erro interno ao buscar notificações.' });
    return;
  }
};

export const markNotificationAsRead = async (req: Request, res: Response) => {
  try {
    const { notificationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      res.status(400).json({ error: 'ID de notificação inválido.' });
      return;
    }

    const notification = await NotificationModel.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      res.status(404).json({ error: 'Notificação não encontrada.' });
      return;
    }

    res.status(200).json(notification);
    return;
  } catch (error) {
    console.error('Erro ao atualizar notificação:', error);
    res.status(500).json({ error: 'Erro interno ao atualizar notificação.' });
    return;
  }
};

export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const { notificationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      res.status(400).json({ error: 'ID de notificação inválido.' });
      return;
    }

    const notification = await NotificationModel.findByIdAndDelete(notificationId);

    if (!notification) {
      res.status(404).json({ error: 'Notificação não encontrada.' });
      return;
    }

    res.status(200).json({ message: 'Notificação deletada com sucesso.' });
    return;
  } catch (error) {
    console.error('Erro ao deletar notificação:', error);
    res.status(500).json({ error: 'Erro interno ao deletar notificação.' });
    return;
  }
};
