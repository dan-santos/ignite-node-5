import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Question, QuestionProps } from '@forum-entities/question';

import { fakerPT_BR as faker } from '@faker-js/faker';

export function makeQuestion(
  override: Partial<QuestionProps> = {},
  id?: UniqueEntityID,
) {
  const fakeQuestion = Question.create({
    title: faker.lorem.sentence(),
    authorId: new UniqueEntityID(),
    content: faker.lorem.text(),
    ...override,
  },
  id,
  );

  return fakeQuestion;
}