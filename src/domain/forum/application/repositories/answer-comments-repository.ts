import { PaginationParams } from '@/core/repositories/pagination-params';
import { AnswerComment } from '@forum-entities/answer-comment';
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author';

export abstract class IAnswerCommentsRepository {
  abstract create(comment: AnswerComment): Promise<void>;
  abstract delete(comment: AnswerComment): Promise<void>;
  abstract findById(answerCommentId: string): Promise<AnswerComment | null>;
  abstract findManyByAnswerId(answerId: string, params: PaginationParams): Promise<AnswerComment[]>;
  abstract findManyByAnswerIdWithAuthor(questionId: string, params: PaginationParams): Promise<CommentWithAuthor[]>;
}