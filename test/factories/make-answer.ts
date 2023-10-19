import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Answer, AnswerProps } from '@forum-entities/answer';

import { fakerPT_BR as faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaAnswerMapper } from '@/infra/database/prisma/mappers/prisma-answer-mapper';

export function makeAnswer(
  override: Partial<AnswerProps> = {},
  id?: UniqueEntityID,
) {
  const fakeAnswer = Answer.create({
    questionId: new UniqueEntityID(),
    authorId: new UniqueEntityID(),
    content: faker.lorem.text(),
    ...override,
  },
  id,
  );

  return fakeAnswer;
}

@Injectable()
export class AnswerFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAnswer(data: Partial<AnswerProps> = {}): Promise<Answer> {
    const answer = makeAnswer(data);

    await this.prisma.answer.create({
      data: PrismaAnswerMapper.toDatabase(answer),
    });

    return answer;
  }
}