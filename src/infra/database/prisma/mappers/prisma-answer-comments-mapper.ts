import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { AnswerComment } from '@forum-entities/answer-comment';
import { Prisma, Comment as PrismaComment } from '@prisma/client';

export class PrismaAnswerCommentsMapper {
  static toDomain(raw: PrismaComment): AnswerComment {
    if (!raw.answerId) {
      throw new Error('Invalid comment type');
    }

    return AnswerComment.create(
      {
        content: raw.content,
        answerId: new UniqueEntityID(raw.answerId),
        authorId: new UniqueEntityID(raw.authorId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toDatabase(raw: AnswerComment): Prisma.CommentUncheckedCreateInput {
    return {
      id: raw.id.toString(),
      authorId: raw.authorId.toString(),
      answerId: raw.answerId.toString(),
      content: raw.content,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt
    };
  }
}