import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { QuestionComment } from '@forum-entities/question-comment';
import { Prisma, Comment as PrismaComment } from '@prisma/client';

export class PrismaQuestionCommentsMapper {
  static toDomain(raw: PrismaComment): QuestionComment {
    if (!raw.questionId) {
      throw new Error('Invalid comment type');
    }

    return QuestionComment.create(
      {
        content: raw.content,
        questionId: new UniqueEntityID(raw.questionId),
        authorId: new UniqueEntityID(raw.authorId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toDatabase(raw: QuestionComment): Prisma.CommentUncheckedCreateInput {
    return {
      id: raw.id.toString(),
      authorId: raw.authorId.toString(),
      questionId: raw.questionId.toString(),
      content: raw.content,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt
    };
  }
}