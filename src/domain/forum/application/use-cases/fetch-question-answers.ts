import { IAnswersRepository } from '@forum-repositories/answers-repository';
import { Answer } from '@forum-entities/answer';
import { Either, right } from '@/core/either';

interface FetchQuestionAnswersUseCaseRequest {
  page: number;
  questionId: string;
}

type FetchQuestionAnswersUseCaseResponse = Either<null, {
  answers: Answer[];
}>

export class FetchQuestionAnswersUseCase {
  constructor(
    private answersRepository: IAnswersRepository,
  ){}
  async execute({ questionId, page }: FetchQuestionAnswersUseCaseRequest): 
    Promise<FetchQuestionAnswersUseCaseResponse> {
    const answers = await this.answersRepository.findManyByQuestionId(questionId, { page });

    return right({ answers });
  }
}