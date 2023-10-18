import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository';
import { ReadNotificationUseCase } from './read-notification';
import { makeNotification } from 'test/factories/make-notification';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ForbiddenError } from '@/core/errors/custom-errors';

let notificationRepository: InMemoryNotificationsRepository;
let sut: ReadNotificationUseCase;

describe('Read notification tests', () => {
  beforeEach(() => {
    notificationRepository = new InMemoryNotificationsRepository();
    sut = new ReadNotificationUseCase(notificationRepository);
  });

  it('should be able to read a notification', async () => {
    const notification = makeNotification(
      {
        recipientId: new UniqueEntityID('1')
      }, 
      new UniqueEntityID('1')
    );

    await notificationRepository.create(notification);

    const result = await sut.execute({
      notificationId: notification.id.toString(),
      recipientId: notification.recipientId.toString()
    });
  
    expect(result.isRight()).toBe(true);
    expect(notificationRepository.notifications[0].createdAt).toEqual(expect.any(Date));
  });

  it('should NOT be able to read a notification of another user', async () => {
    const notification = makeNotification(
      {
        recipientId: new UniqueEntityID('1')
      }, 
      new UniqueEntityID('1')
    );

    await notificationRepository.create(notification);

    const result = await sut.execute({
      notificationId: notification.id.toString(),
      recipientId: 'unexistent-recipient-id'
    });
  
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ForbiddenError);
  });
});