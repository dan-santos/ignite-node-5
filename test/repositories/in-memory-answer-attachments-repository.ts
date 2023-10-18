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
}