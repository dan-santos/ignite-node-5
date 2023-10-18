import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Slug } from '@forum-entities/value-objects/slug';
import { Question } from '@forum-entities/question';
import { Prisma, Question as PrismaQuestion } from '@prisma/client';

export class PrismaQuestionMapper {
  static toDomain(raw: PrismaQuestion): Question {
    return Question.create(
      {
        title: raw.title,
        content: raw.content,
        authorId: new UniqueEntityID(raw.authorId),
        bestAnswerId: raw.bestAnswerId ? new UniqueEntityID(raw.bestAnswerId) : null,
        slug: Slug.create(raw.slug),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toDatabase(raw: Question): Prisma.QuestionUncheckedCreateInput {
    return {
      id: raw.id.toString(),
      authorId: raw.authorId.toString(),
      bestAnswerId: raw.bestAnswerId?.toString(),
      title: raw.title,
      content: raw.content,
      slug: raw.slug.content,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt
    };
  }
}