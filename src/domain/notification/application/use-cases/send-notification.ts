import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Notification } from '@notification-entities/notification';
import { Either, right } from '@/core/either';
import { INotificationsRepository } from '@notification-repositories/notifications-repository';
import { Injectable } from '@nestjs/common';

export interface SendNotificationUseCaseRequest {
  recipientId: string;
  title: string;
  content: string;
}

export type SendNotificationUseCaseResponse = Either<null, {
  notification: Notification;
}>

@Injectable()
export class SendNotificationUseCase {
  constructor(
    private notificationsRepository: INotificationsRepository,
  ){}
  async execute({ 
    recipientId, 
    title, 
    content,
  }: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
    const notification = Notification.create({
      recipientId: new UniqueEntityID(recipientId),
      title,
      content
    });

    await this.notificationsRepository.create(notification);

    return right({ notification });
  }
}