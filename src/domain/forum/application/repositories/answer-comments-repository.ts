import { PaginationParams } from '@/core/repositories/pagination-params';
import { AnswerComment } from '@forum-entities/answer-comment';

export interface IAnswerCommentsRepository {
  create(comment: AnswerComment): Promise<void>;
  delete(comment: AnswerComment): Promise<void>;
  findById(answerCommentId: string): Promise<AnswerComment | null>;
  findManyByAnswerId(answerId: string, params: PaginationParams): Promise<AnswerComment[]>;
}