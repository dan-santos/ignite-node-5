import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { AnswerAttachment, AnswerAttachmentProps } from '@forum-entities/answer-attachment';
import { Injectable } from '@nestjs/common';

export function makeAnswerAttachment(
  override: Partial<AnswerAttachmentProps> = {},
  id?: UniqueEntityID,
) {
  const fakeAnswerAttachment = AnswerAttachment.create({
    answerId: new UniqueEntityID(),
    attachmentId: new UniqueEntityID(),
    ...override,
  },
  id,
  );

  return fakeAnswerAttachment;
}

@Injectable()
export class AnswerAttachmentFactory {
  constructor(private prisma: PrismaService) {}

  async makeDatabaseAnswerAttachment(data: Partial<AnswerAttachmentProps> = {}): Promise<AnswerAttachment> {
    const answerAttachment = makeAnswerAttachment(data);

    await this.prisma.attachment.update({
      where: {
        id: answerAttachment.attachmentId.toString(),
      },
      data: {
        answerId: answerAttachment.answerId.toString(),
      },
    });

    return answerAttachment;
  }
}