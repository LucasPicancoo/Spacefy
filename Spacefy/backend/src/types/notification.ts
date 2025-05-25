// types/notification.ts

export interface INotification extends Document {
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
  createdAt: Date;
  updatedAt: Date;
}
