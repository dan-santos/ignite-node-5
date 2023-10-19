import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { QuestionComment, QuestionCommentProps } from '@forum-entities/question-comment';

import { fakerPT_BR as faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaQuestionCommentsMapper } from '@/infra/database/prisma/mappers/prisma-question-comments-mapper';

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

@Injectable()
export class QuestionCommentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaQuestionComment(data: Partial<QuestionCommentProps> = {}): Promise<QuestionComment> {
    const answer = makeQuestionComment(data);

    await this.prisma.comment.create({
      data: PrismaQuestionCommentsMapper.toDatabase(answer),
    });

    return answer;
  }
}