import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { AnswerComment, AnswerCommentProps } from '@forum-entities/answer-comment';

import { fakerPT_BR as faker } from '@faker-js/faker';

export function makeAnswerComment(
  override: Partial<AnswerCommentProps> = {},
  id?: UniqueEntityID,
) {
  const fakeAnswerComment = AnswerComment.create({
    authorId: new UniqueEntityID(),
    answerId: new UniqueEntityID(),
    content: faker.lorem.text(),
    ...override,
  },
  id,
  );

  return fakeAnswerComment;
}