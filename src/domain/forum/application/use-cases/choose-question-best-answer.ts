import { IAnswersRepository } from '@forum-repositories/answers-repository';
import { Question } from '@forum-entities/question';
import { IQuestionsRepository } from '@forum-repositories/questions-repository';
import { Either, left, right } from '@/core/either';
import { ForbiddenError, ResourceNotFoundError } from '@/core/errors/custom-errors';

interface ChooseQuestionBestAnswerUseCaseRequest {
  authorId: string;
  answerId: string;
}

type ChooseQuestionBestAnswerUseCaseResponse = Either<ResourceNotFoundError | ForbiddenError, {
  question: Question;
}>

export class ChooseQuestionBestAnswerUseCase {
  constructor(
    private answersRepository: IAnswersRepository,
    private questionsRepository: IQuestionsRepository
  ){}
  async execute({ 
    authorId, 
    answerId,
  }: ChooseQuestionBestAnswerUseCaseRequest): Promise<ChooseQuestionBestAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId);
    if (!answer) return left(new ResourceNotFoundError());
    
    const question = await this.questionsRepository.findById(answer.questionId.toString());
    if (!question) return left(new ResourceNotFoundError());

    if (question.authorId.toString() !== authorId) {
      return left(new ForbiddenError());
    }

    question.bestAnswerId = answer.id;
    await this.questionsRepository.save(question);
    
    return right({ question });
  }
}