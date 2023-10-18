import { IQuestionCommentsRepository } from '@forum-repositories/question-comments-repository';
import { QuestionComment } from '@forum-entities/question-comment';
import { Either, right } from '@/core/either';

interface FetchQuestionCommentsUseCaseRequest {
  page: number;
  questionId: string;
}

type FetchQuestionCommentsUseCaseResponse = Either<null, {
  comments: QuestionComment[];
}>

export class FetchQuestionCommentsUseCase {
  constructor(
    private questionCommentsRepository: IQuestionCommentsRepository,
  ){}
  async execute({ questionId, page }: FetchQuestionCommentsUseCaseRequest): 
    Promise<FetchQuestionCommentsUseCaseResponse> {
    const comments = await this.questionCommentsRepository.findManyByQuestionId(questionId, { page });

    return right({ comments });
  }
}