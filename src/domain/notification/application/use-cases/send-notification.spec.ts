import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository';
import { SendNotificationUseCase } from './send-notification';

let notificationRepository: InMemoryNotificationsRepository;
let sut: SendNotificationUseCase;

describe('Send notification tests', () => {
  beforeEach(() => {
    notificationRepository = new InMemoryNotificationsRepository();
    sut = new SendNotificationUseCase(notificationRepository);
  });

  it('should be able to send a notification', async () => {
    const result = await sut.execute({
      content: 'Content of notification',
      title: 'New notification!',
      recipientId: '1'
    });
  
    expect(result.isRight()).toBe(true);
    expect(notificationRepository.notifications[0]).toEqual(result.value?.notification);
    expect(notificationRepository.notifications).toHaveLength(1);
  });
});