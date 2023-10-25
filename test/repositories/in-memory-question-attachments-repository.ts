import { 
  IQuestionAttachmentsRepository 
} from '@forum-repositories/question-attachments-repository';
import { QuestionAttachment } from '@forum-entities/question-attachment';

export class InMemoryQuestionAttachmentsRepository implements IQuestionAttachmentsRepository {
  
  public items: QuestionAttachment[] = [];

  async createMany(attachments: QuestionAttachment[]): Promise<void> {
    this.items.push(...attachments);
  }
  
  async deleteMany(attachments: QuestionAttachment[]): Promise<void> {
    const questionAttachments = this.items.filter((item) => {
      return !attachments.some((attachment) => attachment.equals(item));
    });

    this.items = questionAttachments;
  }

  async findManyByQuestionId(questionId: string){
    const attachments = this.items
      .filter(attachment => attachment.questionId.toString() === questionId);

    return attachments;
  }

  async deleteManyByQuestionId(questionId: string){
    const remainingAttachments = this.items
      .filter(attachment => attachment.questionId.toString() !== questionId);
    
    this.items = remainingAttachments;
  }
}