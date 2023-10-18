import { IAnswerAttachmentsRepository } from '@forum-repositories/answer-attachments-repository';
import { AnswerAttachment } from '@forum-entities/answer-attachment';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaAnswerAttachmentsRepository implements IAnswerAttachmentsRepository {
  findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    throw new Error('Method not implemented.');
  }
  deleteManyByAnswerId(answerId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}