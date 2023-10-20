import { IAnswerCommentsRepository } from '@forum-repositories/answer-comments-repository';
import { AnswerComment } from '@forum-entities/answer-comment';
import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';

interface FetchAnswerCommentsUseCaseRequest {
  page: number;
  answerId: string;
}

type FetchAnswerCommentsUseCaseResponse = Either<null, {
  comments: AnswerComment[];
}>

@Injectable()
export class FetchAnswerCommentsUseCase {
  constructor(
    private answerCommentsRepository: IAnswerCommentsRepository,
  ){}
  async execute({ answerId, page }: FetchAnswerCommentsUseCaseRequest): 
    Promise<FetchAnswerCommentsUseCaseResponse> {
    const comments = await this.answerCommentsRepository.findManyByAnswerId(answerId, { page });

    return right({ comments });
  }
}