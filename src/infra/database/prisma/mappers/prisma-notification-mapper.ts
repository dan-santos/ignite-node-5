import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Notification } from '@notification-entities/notification';
import { Prisma, Notification as PrismaNotification } from '@prisma/client';

export class PrismaNotificationMapper {
  static toDomain(raw: PrismaNotification): Notification {
    return Notification.create(
      {
        title: raw.title,
        content: raw.content,
        recipientId: new UniqueEntityID(raw.recipientId),
        createdAt: raw.createdAt,
        readAt: raw.readAt
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toDatabase(raw: Notification): Prisma.NotificationUncheckedCreateInput {
    return {
      id: raw.id.toString(),
      recipientId: raw.recipientId.toString(),
      title: raw.title,
      content: raw.content,
      createdAt: raw.createdAt,
      readAt: raw.readAt
    };
  }
}