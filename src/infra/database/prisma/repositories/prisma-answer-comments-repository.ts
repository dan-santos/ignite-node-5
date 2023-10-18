import { PaginationParams } from '@/core/repositories/pagination-params';
import { IAnswerCommentsRepository } from '@forum-repositories/answer-comments-repository';
import { AnswerComment } from '@forum-entities/answer-comment';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaAnswerCommentsRepository implements IAnswerCommentsRepository {
  create(comment: AnswerComment): Promise<void> {
    throw new Error('Method not implemented.');
  }
  delete(comment: AnswerComment): Promise<void> {
    throw new Error('Method not implemented.');
  }
  findById(answerCommentId: string): Promise<AnswerComment | null> {
    throw new Error('Method not implemented.');
  }
  findManyByAnswerId(answerId: string, params: PaginationParams): Promise<AnswerComment[]> {
    throw new Error('Method not implemented.');
  }

}