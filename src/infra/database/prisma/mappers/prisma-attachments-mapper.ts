import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Attachment } from '@forum-entities/attachment';
import { Prisma, Attachment as PrismaAttachment } from '@prisma/client';

export class PrismaAttachmentsMapper {
  static toDomain(raw: PrismaAttachment): Attachment {
    return Attachment.create({
      title: raw.title,
      url: raw.url
    }, new UniqueEntityID(raw.id));
  }
  
  static toDatabase(raw: Attachment): Prisma.AttachmentUncheckedCreateInput {
    return {
      id: raw.id.toString(),
      title: raw.title,
      url: raw.url
    };
  }
}