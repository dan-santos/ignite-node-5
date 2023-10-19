import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { AnswerComment, AnswerCommentProps } from '@forum-entities/answer-comment';

import { fakerPT_BR as faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaAnswerCommentsMapper } from '@/infra/database/prisma/mappers/prisma-answer-comments-mapper';

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

@Injectable()
export class AnswerCommentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAnswerComment(data: Partial<AnswerCommentProps> = {}): Promise<AnswerComment> {
    const answer = makeAnswerComment(data);

    await this.prisma.comment.create({
      data: PrismaAnswerCommentsMapper.toDatabase(answer),
    });

    return answer;
  }
}