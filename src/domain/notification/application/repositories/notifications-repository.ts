import { Notification } from '@notification-entities/notification';

export interface INotificationsRepository {
  create(notification: Notification): Promise<void>;
  save(notification: Notification): Promise<void>;
  findById(notificationId: string): Promise<Notification | null>;
}