import { IQuestionCommentsRepository } from '@forum-repositories/question-comments-repository';
import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author';

interface FetchQuestionCommentsUseCaseRequest {
  page: number;
  questionId: string;
}

type FetchQuestionCommentsUseCaseResponse = Either<null, {
  comments: CommentWithAuthor[];
}>

@Injectable()
export class FetchQuestionCommentsUseCase {
  constructor(
    private questionCommentsRepository: IQuestionCommentsRepository,
  ){}
  async execute({ questionId, page }: FetchQuestionCommentsUseCaseRequest): 
    Promise<FetchQuestionCommentsUseCaseResponse> {
    const comments = await this.questionCommentsRepository.findManyByQuestionIdWithAuthor(questionId, { page });

    return right({ comments });
  }
}