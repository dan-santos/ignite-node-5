import { PaginationParams } from '@/core/repositories/pagination-params';
import { IAnswersRepository } from '@forum-repositories/answers-repository';
import { Answer } from '@forum-entities/answer';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaAnswerMapper } from '../mappers/prisma-answer-mapper';

@Injectable()
export class PrismaAnswersRepository implements IAnswersRepository {
  constructor(private prisma: PrismaService){}
  
  async create(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toDatabase(answer);

    await this.prisma.answer.create({
      data,
    });
  }
  
  async delete(answer: Answer): Promise<void> {
    await this.prisma.answer.delete({
      where: {
        id: answer.id.toString(),
      },
    });
  }

  async save(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toDatabase(answer);

    await this.prisma.answer.update({
      where: {
        id: data.id,
      },
      data,
    });
  }

  async findById(answerId: string): Promise<Answer | null> {
    const answer = await this.prisma.answer.findUnique({
      where: {
        id: answerId,
      },
    });

    if (!answer) return null;

    return PrismaAnswerMapper.toDomain(answer);
  }

  async findManyByQuestionId(questionId: string, params: PaginationParams): Promise<Answer[]> {
    const answers = await this.prisma.answer.findMany({
      where: {
        questionId,
      },
      take: 20,
      skip: ( params.page - 1 ) * 20
    });

    return answers.map(PrismaAnswerMapper.toDomain);
  }
}