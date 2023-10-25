import { IAnswerAttachmentsRepository } from '@forum-repositories/answer-attachments-repository';
import { AnswerAttachment } from '@forum-entities/answer-attachment';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaAnswerAttachmentsMapper } from '../mappers/prisma-answer-attachments-mapper';

@Injectable()
export class PrismaAnswerAttachmentsRepository implements IAnswerAttachmentsRepository {
  constructor(private prisma: PrismaService) {}

  async createMany(attachments: AnswerAttachment[]): Promise<void> {
    if (attachments.length === 0) return;
    
    const data = PrismaAnswerAttachmentsMapper.toDatabaseUpdateMany(attachments);

    await this.prisma.attachment.updateMany(data);
  }

  async deleteMany(attachments: AnswerAttachment[]): Promise<void> {
    if (attachments.length === 0) return;

    const attachmentsIds = attachments.map(attachment => attachment.id.toString());

    await this.prisma.attachment.deleteMany({
      where: {
        id: {
          in: attachmentsIds
        },
      },
    });
  }

  async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    const answerAttachments = await this.prisma.attachment.findMany({
      where: {
        answerId,
      }
    });

    return answerAttachments.map(PrismaAnswerAttachmentsMapper.toDomain);
  }
  
  async deleteManyByAnswerId(answerId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: {
        answerId,
      },
    });
  }
}