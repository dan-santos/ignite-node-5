import { PaginationParams } from '@/core/repositories/pagination-params';
import { IQuestionsRepository } from '@forum-repositories/questions-repository';
import { Question } from '@forum-entities/question';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaQuestionMapper } from '../mappers/prisma-question-mapper';

@Injectable()
export class PrismaQuestionsRepository implements IQuestionsRepository {
  constructor(private prisma: PrismaService){}

  async create(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toDatabase(question);

    await this.prisma.question.create({
      data,
    });
  }

  async delete(question: Question): Promise<void> {
    await this.prisma.question.delete({
      where: {
        id: question.id.toString(),
      },
    });
  }

  async save(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toDatabase(question);

    await this.prisma.question.update({
      where: {
        id: data.id,
      },
      data,
    });
  }
  
  async findBySlug(slug: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: {
        slug,
      },
    });

    if (!question) return null;

    return PrismaQuestionMapper.toDomain(question);
  }

  async findById(questionId: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: {
        id: questionId,
      },
    });

    if (!question) return null;

    return PrismaQuestionMapper.toDomain(question);
  }

  async findManyRecent(params: PaginationParams): Promise<Question[]> {
    const questions = await this.prisma.question.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: ( params.page - 1 ) * 20
    });

    return questions.map(PrismaQuestionMapper.toDomain);
  }
  
}