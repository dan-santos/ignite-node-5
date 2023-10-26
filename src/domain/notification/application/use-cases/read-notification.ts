import { Notification } from '@notification-entities/notification';
import { Either, left, right } from '@/core/either';
import { INotificationsRepository } from '@notification-repositories/notifications-repository';
import { ForbiddenError, ResourceNotFoundError } from '@/core/errors/custom-errors';
import { Injectable } from '@nestjs/common';

interface ReadNotificationUseCaseRequest {
  notificationId: string;
  recipientId: string;
}

type ReadNotificationUseCaseResponse = Either<ResourceNotFoundError | ForbiddenError, {
  notification: Notification;
}>

@Injectable()
export class ReadNotificationUseCase {
  constructor(
    private notificationsRepository: INotificationsRepository,
  ){}
  async execute({ 
    notificationId,
    recipientId,
  }: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
    const notification = await this.notificationsRepository.findById(notificationId);

    if (!notification) return left(new ResourceNotFoundError());

    if (notification.recipientId.toString() !== recipientId) return left(new ForbiddenError());

    notification.read();

    await this.notificationsRepository.save(notification);

    return right({ notification });
  }
}