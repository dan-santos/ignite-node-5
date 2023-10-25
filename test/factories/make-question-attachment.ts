import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { QuestionAttachment, QuestionAttachmentProps } from '@forum-entities/question-attachment';
import { Injectable } from '@nestjs/common';

export function makeQuestionAttachment(
  override: Partial<QuestionAttachmentProps> = {},
  id?: UniqueEntityID,
) {
  const fakeQuestionAttachment = QuestionAttachment.create({
    questionId: new UniqueEntityID(),
    attachmentId: new UniqueEntityID(),
    ...override,
  },
  id,
  );

  return fakeQuestionAttachment;
}

@Injectable()
export class QuestionAttachmentFactory {
  constructor(private prisma: PrismaService) {}

  async makeDatabaseQuestionAttachment(data: Partial<QuestionAttachmentProps> = {}): Promise<QuestionAttachment> {
    const questionAttachment = makeQuestionAttachment(data);

    await this.prisma.attachment.update({
      where: {
        id: questionAttachment.attachmentId.toString(),
      },
      data: {
        questionId: questionAttachment.questionId.toString(),
      },
    });

    return questionAttachment;
  }
}