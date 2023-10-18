import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionComment } from '@forum-entities/question-comment';

export interface IQuestionCommentsRepository {
  create(comment: QuestionComment): Promise<void>;
  delete(comment: QuestionComment): Promise<void>;
  findById(questionCommentId: string): Promise<QuestionComment | null>;
  findManyByQuestionId(questionId: string, params: PaginationParams): Promise<QuestionComment[]>;
}