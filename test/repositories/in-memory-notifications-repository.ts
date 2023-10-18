import { Notification } from '@notification-entities/notification';
import { INotificationsRepository } from '@notification-repositories/notifications-repository';

export class InMemoryNotificationsRepository implements INotificationsRepository {
  public notifications: Notification[] = [];

  async create(notification: Notification): Promise<void> {
    this.notifications.push(notification);
  }

  async findById(notificationId: string){
    const notification = this.notifications.find(notification => notification.id.toString() === notificationId);

    if (!notification) return null;

    return notification;
  }

  async save(notification: Notification){
    const notificationIndex = this.notifications.findIndex(item => item.id === notification.id);

    this.notifications[notificationIndex] = notification;
  }
}