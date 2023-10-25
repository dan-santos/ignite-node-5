import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { QuestionAttachment } from '@forum-entities/question-attachment';
import { Prisma, Attachment as PrismaAttachment } from '@prisma/client';

export class PrismaQuestionAttachmentsMapper {
  static toDomain(raw: PrismaAttachment): QuestionAttachment {
    if (!raw.questionId) {
      throw new Error('Invalid attachment type');
    }

    return QuestionAttachment.create(
      {
        attachmentId: new UniqueEntityID(raw.id),
        questionId: new UniqueEntityID(raw.questionId),
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toDatabaseUpdateMany(
    attachments: QuestionAttachment[]
  ): Prisma.AttachmentUpdateManyArgs {
    const attachmentsIds = attachments.map(attachment => attachment.attachmentId.toString());

    return {
      where: {
        id: {
          in: attachmentsIds
        },
      },
      data: {
        questionId: attachments[0].questionId.toString()
      },
    };
  }
}