import { Attachment } from '@forum-entities/attachment';
import { Prisma } from '@prisma/client';

export class PrismaAttachmentsMapper {
  static toDatabase(raw: Attachment): Prisma.AttachmentUncheckedCreateInput {
    return {
      id: raw.id.toString(),
      title: raw.title,
      url: raw.url
    };
  }
}