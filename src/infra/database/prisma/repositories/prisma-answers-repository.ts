import { PaginationParams } from '@/core/repositories/pagination-params';
import { IAnswersRepository } from '@forum-repositories/answers-repository';
import { Answer } from '@forum-entities/answer';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaAnswerMapper } from '../mappers/prisma-answer-mapper';
import { IAnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository';

@Injectable()
export class PrismaAnswersRepository implements IAnswersRepository {
  constructor(
    private prisma: PrismaService,
    private attachmentsRepository: IAnswerAttachmentsRepository
  ){}
  
  async create(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toDatabase(answer);

    await this.prisma.answer.create({
      data,
    });

    await this.attachmentsRepository.createMany(answer.attachments.getItems());
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

    await Promise.all([
      this.prisma.answer.update({
        where: {
          id: data.id,
        },
        data,
      }),
      this.attachmentsRepository.createMany(answer.attachments.getNewItems()),
      this.attachmentsRepository.deleteMany(answer.attachments.getRemovedItems()),
    ]);
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