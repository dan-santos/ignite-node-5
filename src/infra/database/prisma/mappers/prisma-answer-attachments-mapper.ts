import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { AnswerAttachment } from '@forum-entities/answer-attachment';
import { Prisma, Attachment as PrismaAttachment } from '@prisma/client';

export class PrismaAnswerAttachmentsMapper {
  static toDomain(raw: PrismaAttachment): AnswerAttachment {
    if (!raw.answerId) {
      throw new Error('Invalid attachment type');
    }

    return AnswerAttachment.create(
      {
        attachmentId: new UniqueEntityID(raw.id),
        answerId: new UniqueEntityID(raw.answerId),
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toDatabaseUpdateMany(
    attachments: AnswerAttachment[]
  ): Prisma.AttachmentUpdateManyArgs {
    const attachmentsIds = attachments.map(attachment => attachment.attachmentId.toString());
  
    return {
      where: {
        id: {
          in: attachmentsIds
        },
      },
      data: {
        answerId: attachments[0].answerId.toString()
      },
    };
  }
}