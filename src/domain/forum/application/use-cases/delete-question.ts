import { Either, left, right } from '@/core/either';
import { IQuestionsRepository } from '@forum-repositories/questions-repository';
import { ForbiddenError, ResourceNotFoundError } from '@/core/errors/custom-errors';
import { Injectable } from '@nestjs/common';

interface DeleteQuestionUseCaseRequest {
  questionId: string;
  authorId: string;
}

type DeleteQuestionUseCaseResponse = Either<ResourceNotFoundError | ForbiddenError, null>

@Injectable()
export class DeleteQuestionUseCase {
  constructor(
    private questionsRepository: IQuestionsRepository,
  ){}
  async execute({ questionId, authorId }: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId);

    if (!question) return left(new ResourceNotFoundError());
    if (authorId !== question.authorId.toString()) {
      return left(new ForbiddenError());
    }

    await this.questionsRepository.delete(question);

    return right(null);
  }
}