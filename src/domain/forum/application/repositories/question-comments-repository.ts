import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionComment } from '@forum-entities/question-comment';

export abstract class IQuestionCommentsRepository {
  abstract create(comment: QuestionComment): Promise<void>;
  abstract delete(comment: QuestionComment): Promise<void>;
  abstract findById(questionCommentId: string): Promise<QuestionComment | null>;
  abstract findManyByQuestionId(questionId: string, params: PaginationParams): Promise<QuestionComment[]>;
}