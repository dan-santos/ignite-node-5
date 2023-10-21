import { IAttachmentsRepository } from '@forum-repositories/attachments-repository';
import { Attachment } from '@forum-entities/attachment';

export class InMemoryAttachmentsRepository implements IAttachmentsRepository {
  public items: Attachment[] = [];

  async create(attachment: Attachment): Promise<void> {
    this.items.push(attachment);
  }

  async delete(attachment: Attachment): Promise<void> {
    const attachmentIndex = this.items.findIndex(s => s.id === attachment.id);
    this.items.splice(attachmentIndex, 1);
  }

  async save(attachment: Attachment): Promise<void> {
    const attachmentIndex = this.items.findIndex(s => s.id === attachment.id);
    this.items[attachmentIndex] = attachment;
  }

  async findById(attachmentId: string): Promise<Attachment | null> {
    const attachment = this.items.find(s => s.id.toString() === attachmentId);

    if (!attachment) return null;

    return attachment;
  }
}