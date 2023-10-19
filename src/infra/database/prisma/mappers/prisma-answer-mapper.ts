import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Answer } from '@forum-entities/answer';
import { Prisma, Answer as PrismaAnswer } from '@prisma/client';

export class PrismaAnswerMapper {
  static toDomain(raw: PrismaAnswer): Answer {
    return Answer.create(
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

  static toDatabase(raw: Answer): Prisma.AnswerUncheckedCreateInput {
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