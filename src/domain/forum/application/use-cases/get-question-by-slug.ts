import { IQuestionsRepository } from '@forum-repositories/questions-repository';
import { Question } from '@forum-entities/question';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/custom-errors';
import { Injectable } from '@nestjs/common';

interface GetQuestionBySlugUseCaseRequest {
  slug: string;
}

type GetQuestionBySlugUseCaseResponse = Either<ResourceNotFoundError, {
  question: Question;
}>

@Injectable()
export class GetQuestionBySlugUseCase {
  constructor(
    private questionsRepository: IQuestionsRepository,
  ){}
  async execute({ slug }: GetQuestionBySlugUseCaseRequest): 
    Promise<GetQuestionBySlugUseCaseResponse> {
    const question = await this.questionsRepository.findBySlug(slug);

    if (!question) return left(new ResourceNotFoundError());

    return right({ question });
  }
}