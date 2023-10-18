import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Answer, AnswerProps } from '@forum-entities/answer';

import { fakerPT_BR as faker } from '@faker-js/faker';

export function makeAnswer(
  override: Partial<AnswerProps> = {},
  id?: UniqueEntityID,
) {
  const fakeAnswer = Answer.create({
    questionId: new UniqueEntityID(),
    authorId: new UniqueEntityID(),
    content: faker.lorem.text(),
    ...override,
  },
  id,
  );

  return fakeAnswer;
}