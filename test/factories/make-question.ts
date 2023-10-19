import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Question, QuestionProps } from '@forum-entities/question';

import { fakerPT_BR as faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaQuestionMapper } from '@/infra/database/prisma/mappers/prisma-question-mapper';

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

@Injectable()
export class QuestionFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaQuestion(data: Partial<QuestionProps> = {}): Promise<Question> {
    const question = makeQuestion(data);

    await this.prisma.question.create({
      data: PrismaQuestionMapper.toDatabase(question),
    });

    return question;
  }
}