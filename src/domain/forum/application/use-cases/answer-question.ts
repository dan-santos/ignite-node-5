import { Either, right } from '@/core/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Answer } from '@forum-entities/answer';
import { IAnswersRepository } from '@forum-repositories/answers-repository';
import { AnswerAttachment } from '@forum-entities/answer-attachment';
import { AnswerAttachmentList } from '@forum-entities/answer-attachment-list';

interface AnswerQuestionUseCaseRequest {
  authorId: string;
  questionId: string;
  attachmentsIds: string[];
  content: string;
}

type AnswerQuestionUseCaseResponse = Either<null, {
  answer: Answer
}>

export class AnswerQuestionUseCase {
  constructor(
    private answersRepository: IAnswersRepository,
  ){}
  async execute({ 
    authorId, 
    questionId, 
    content,
    attachmentsIds,
  }: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
    const answer = Answer.create({
      authorId: new UniqueEntityID(authorId),
      questionId: new UniqueEntityID(questionId),
      content
    });

    const answerAttachments = attachmentsIds.map(attachmentId => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        answerId: answer.id,
      });
    });
    answer.attachments = new AnswerAttachmentList(answerAttachments);

    await this.answersRepository.create(answer);

    return right({ answer });
  }
}