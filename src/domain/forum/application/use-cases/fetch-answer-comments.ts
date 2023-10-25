import { IAnswerCommentsRepository } from '@forum-repositories/answer-comments-repository';
import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { CommentWithAuthor } from '@forum-entities/value-objects/comment-with-author';

interface FetchAnswerCommentsUseCaseRequest {
  page: number;
  answerId: string;
}

type FetchAnswerCommentsUseCaseResponse = Either<null, {
  comments: CommentWithAuthor[];
}>

@Injectable()
export class FetchAnswerCommentsUseCase {
  constructor(
    private answerCommentsRepository: IAnswerCommentsRepository,
  ){}
  async execute({ answerId, page }: FetchAnswerCommentsUseCaseRequest): 
    Promise<FetchAnswerCommentsUseCaseResponse> {
    const comments = await this.answerCommentsRepository.findManyByAnswerIdWithAuthor(answerId, { page });

    return right({ comments });
  }
}