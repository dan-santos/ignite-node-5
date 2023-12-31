import { PaginationParams } from '@/core/repositories/pagination-params';
import { IQuestionsRepository } from '@forum-repositories/questions-repository';
import { Question } from '@forum-entities/question';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaQuestionMapper } from '../mappers/prisma-question-mapper';
import { IQuestionAttachmentsRepository } from '@forum-repositories/question-attachments-repository';
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details';
import { PrismaQuestionDetailsMapper } from '../mappers/prisma-question-details-mapper';
import { DomainEvents } from '@/core/events/domain-events';
import { ICacheRepository } from '@/infra/cache/cache-repository';

@Injectable()
export class PrismaQuestionsRepository implements IQuestionsRepository {
  constructor(
    private prisma: PrismaService,
    private cache: ICacheRepository,
    private attachmentsRepository: IQuestionAttachmentsRepository  
  ){}

  async create(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toDatabase(question);

    await this.prisma.question.create({
      data,
    });

    await this.attachmentsRepository.createMany(question.attachments.getItems());
    DomainEvents.dispatchEventsForAggregate(question.id);
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

    await Promise.all([
      this.prisma.question.update({
        where: {
          id: data.id,
        },
        data,
      }),
      this.attachmentsRepository.createMany(question.attachments.getNewItems()),
      this.attachmentsRepository.deleteMany(question.attachments.getRemovedItems()),
      this.cache.delete(`question:${data.slug}:details`)
    ]);

    DomainEvents.dispatchEventsForAggregate(question.id);
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

  async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
    const cacheHit = await this.cache.get(`question:${slug}:details`);
    if (cacheHit) return JSON.parse(cacheHit);

    const question = await this.prisma.question.findUnique({
      where: {
        slug,
      },
      include: {
        author: true,
        attachments: true
      }
    });

    if (!question) return null;

    const questionDetails = PrismaQuestionDetailsMapper.toDomain(question);
    
    await this.cache.set(`question:${slug}:details`, JSON.stringify(questionDetails));
    return questionDetails;
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