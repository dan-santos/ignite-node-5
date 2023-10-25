import { IAnswerAttachmentsRepository } from '@forum-repositories/answer-attachments-repository';
import { AnswerAttachment } from '@forum-entities/answer-attachment';

export class InMemoryAnswerAttachmentsRepository implements IAnswerAttachmentsRepository {
  public items: AnswerAttachment[] = [];

  async findManyByAnswerId(answerId: string){
    const attachments = this.items
      .filter(attachment => attachment.answerId.toString() === answerId);

    return attachments;
  }

  async deleteManyByAnswerId(answerId: string){
    const remainingAttachments = this.items
      .filter(attachment => attachment.answerId.toString() !== answerId);
    
    this.items = remainingAttachments;
  }

  async createMany(attachments: AnswerAttachment[]): Promise<void> {
    this.items.push(...attachments);
  }
  
  async deleteMany(attachments: AnswerAttachment[]): Promise<void> {
    const answerAttachments = this.items.filter((item) => {
      return !attachments.some((attachment) => attachment.equals(item));
    });

    this.items = answerAttachments;
  }
}