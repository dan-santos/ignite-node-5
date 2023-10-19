import { IQuestionAttachmentsRepository } from '@forum-repositories/question-attachments-repository';
import { QuestionAttachment } from '@forum-entities/question-attachment';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaQuestionAttachmentsMapper } from '../mappers/prisma-question-attachments-mapper';

@Injectable()
export class PrismaQuestionAttachmentsRepository implements IQuestionAttachmentsRepository {
  constructor(private prisma: PrismaService) {}

  async findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]> {
    const questionAttachments = await this.prisma.attachment.findMany({
      where: {
        questionId,
      }
    });

    return questionAttachments.map(PrismaQuestionAttachmentsMapper.toDomain);
  }
  
  async deleteManyByQuestionId(questionId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: {
        questionId,
      },
    });
  }
}