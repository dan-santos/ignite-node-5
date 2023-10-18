import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { QuestionComment, QuestionCommentProps } from '@forum-entities/question-comment';

import { fakerPT_BR as faker } from '@faker-js/faker';

export function makeQuestionComment(
  override: Partial<QuestionCommentProps> = {},
  id?: UniqueEntityID,
) {
  const fakeQuestionComment = QuestionComment.create({
    authorId: new UniqueEntityID(),
    questionId: new UniqueEntityID(),
    content: faker.lorem.text(),
    ...override,
  },
  id,
  );

  return fakeQuestionComment;
}