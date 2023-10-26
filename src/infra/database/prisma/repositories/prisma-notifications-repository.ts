import { INotificationsRepository } from '@notification-repositories/notifications-repository';
import { Notification } from '@notification-entities/notification';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaNotificationMapper } from '../mappers/prisma-notification-mapper';

@Injectable()
export class PrismaNotificationsRepository implements INotificationsRepository {
  constructor(private prisma: PrismaService){}

  async create(notification: Notification): Promise<void> {
    const data = PrismaNotificationMapper.toDatabase(notification);

    await this.prisma.notification.create({
      data,
    });
  }

  async save(notification: Notification): Promise<void> {
    const data = PrismaNotificationMapper.toDatabase(notification);

    await this.prisma.notification.update({
      where: {
        id: data.id,
      },
      data,
    });
  }

  async findById(notificationId: string): Promise<Notification | null> {
    const notification = await this.prisma.notification.findUnique({
      where: {
        id: notificationId,
      },
    });

    if (!notification) return null;

    return PrismaNotificationMapper.toDomain(notification);
  }
}