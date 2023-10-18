import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Notification, NotificationProps } from '@notification-entities/notification';

import { fakerPT_BR as faker } from '@faker-js/faker';

export function makeNotification(
  override: Partial<NotificationProps> = {},
  id?: UniqueEntityID,
) {
  const fakeNotification = Notification.create({
    recipientId: new UniqueEntityID(),
    title: faker.lorem.sentence(),
    content: faker.lorem.text(),
    ...override,
  },
  id,
  );

  return fakeNotification;
}