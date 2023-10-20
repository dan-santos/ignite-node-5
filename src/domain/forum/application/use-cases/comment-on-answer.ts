import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { IAnswersRepository } from '@forum-repositories/answers-repository';
import { AnswerComment } from '@forum-entities/answer-comment';
import { IAnswerCommentsRepository } from '../repositories/answer-comments-repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/custom-errors';
import { Injectable } from '@nestjs/common';

interface CommentOnAnswerUseCaseRequest {
  authorId: string;
  answerId: string;
  content: string;
}

type CommentOnAnswerUseCaseResponse = Either<ResourceNotFoundError, {
  comment: AnswerComment;
}>

@Injectable()
export class CommentOnAnswerUseCase {
  constructor(
    private answersRepository: IAnswersRepository,
    private answerCommentsRepository: IAnswerCommentsRepository
  ){}
  async execute({ 
    authorId, 
    answerId, 
    content 
  }: CommentOnAnswerUseCaseRequest): Promise<CommentOnAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId);

    if (!answer) return left(new ResourceNotFoundError());

    const comment = AnswerComment.create({
      authorId: new UniqueEntityID(authorId),
      answerId: new UniqueEntityID(answerId),
      content
    });

    await this.answerCommentsRepository.create(comment);

    return right({ comment });
  }
}