import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { AnswerAttachment, AnswerAttachmentProps } from '@forum-entities/answer-attachment';

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