import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { IQuestionsRepository } from '@forum-repositories/questions-repository';
import { Question } from '@forum-entities/question';
import { Either, right } from '@/core/either';
import { QuestionAttachment } from '@forum-entities/question-attachment';
import { QuestionAttachmentList } from '@forum-entities/question-attachment-list';
import { Injectable } from '@nestjs/common';

interface CreateQuestionUseCaseRequest {
  authorId: string;
  title: string;
  content: string;
  attachmentsIds: string[];
}

type CreateQuestionUseCaseResponse = Either<null, {
  question: Question;
}>

// obs: by the book of clean architecture, we should create a use case representation in infra layer to
// be consumed by Nest (interface adapter). But injection of the domain use case directly, at this moment,
// seems more advantageous.
@Injectable()
export class CreateQuestionUseCase {
  constructor(
    private questionsRepository: IQuestionsRepository,
  ){}
  async execute({ 
    authorId, 
    title, 
    content,
    attachmentsIds,
  }: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
    const question = Question.create({
      authorId: new UniqueEntityID(authorId),
      title,
      content
    });

    const questionAttachments = attachmentsIds.map(attachmentId => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        questionId: question.id,
      });
    });
    question.attachments = new QuestionAttachmentList(questionAttachments);

    await this.questionsRepository.create(question);

    return right({ question });
  }
}