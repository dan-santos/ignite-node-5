import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionComment } from '@forum-entities/question-comment';
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author';

export abstract class IQuestionCommentsRepository {
  abstract create(comment: QuestionComment): Promise<void>;
  abstract delete(comment: QuestionComment): Promise<void>;
  abstract findById(questionCommentId: string): Promise<QuestionComment | null>;
  abstract findManyByQuestionId(questionId: string, params: PaginationParams): Promise<QuestionComment[]>;
  abstract findManyByQuestionIdWithAuthor(questionId: string, params: PaginationParams): Promise<CommentWithAuthor[]>;
}