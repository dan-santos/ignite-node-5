import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { IQuestionsRepository } from '@forum-repositories/questions-repository';
import { QuestionComment } from '@forum-entities/question-comment';
import { IQuestionCommentsRepository } from '@forum-repositories/question-comments-repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/custom-errors';
import { Injectable } from '@nestjs/common';

interface CommentOnQuestionUseCaseRequest {
  authorId: string;
  questionId: string;
  content: string;
}

type CommentOnQuestionUseCaseResponse = Either<ResourceNotFoundError, {
  comment: QuestionComment;
}>

@Injectable()
export class CommentOnQuestionUseCase {
  constructor(
    private questionsRepository: IQuestionsRepository,
    private questionCommentsRepository: IQuestionCommentsRepository
  ){}
  async execute({ 
    authorId, 
    questionId, 
    content 
  }: CommentOnQuestionUseCaseRequest): Promise<CommentOnQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId);

    if (!question) return left(new ResourceNotFoundError());

    const comment = QuestionComment.create({
      authorId: new UniqueEntityID(authorId),
      questionId: new UniqueEntityID(questionId),
      content
    });

    await this.questionCommentsRepository.create(comment);

    return right({ comment });
  }
}