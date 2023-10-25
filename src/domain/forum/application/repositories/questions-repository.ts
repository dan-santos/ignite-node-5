import { PaginationParams } from '@/core/repositories/pagination-params';
import { Question } from '@forum-entities/question';
import { QuestionDetails } from '../../enterprise/entities/value-objects/question-details';

export abstract class IQuestionsRepository {
  abstract create(question: Question): Promise<void>;
  abstract delete(question: Question): Promise<void>;
  abstract save(question: Question): Promise<void>;
  abstract findBySlug(slug: string): Promise<Question | null>;
  abstract findDetailsBySlug(slug: string): Promise<QuestionDetails | null>;
  abstract findById(questionId: string): Promise<Question | null>;
  abstract findManyRecent(params: PaginationParams): Promise<Question[]>;
}