import { PaginationParams } from '@/core/repositories/pagination-params';
import { Answer } from '@forum-entities/answer';

export abstract class IAnswersRepository {
  abstract create(answer: Answer): Promise<void>;
  abstract delete(answer: Answer): Promise<void>;
  abstract save(answer: Answer): Promise<void>;
  abstract findById(answerId: string): Promise<Answer | null>;
  abstract findManyByQuestionId(questionId: string, params: PaginationParams): Promise<Answer[]>
}