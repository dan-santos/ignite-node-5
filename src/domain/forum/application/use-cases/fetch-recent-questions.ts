import { IQuestionsRepository } from '@forum-repositories/questions-repository';
import { Question } from '@forum-entities/question';
import { Either, right } from '@/core/either';

interface FetchRecentQuestionsUseCaseRequest {
  page: number;
}

type FetchRecentQuestionsUseCaseResponse = Either<null, {
  questions: Question[];
}>

export class FetchRecentQuestionsUseCase {
  constructor(
    private questionsRepository: IQuestionsRepository,
  ){}
  async execute({ page }: FetchRecentQuestionsUseCaseRequest): 
    Promise<FetchRecentQuestionsUseCaseResponse> {
    const questions = await this.questionsRepository.findManyRecent({ page });

    return right({ questions });
  }
}