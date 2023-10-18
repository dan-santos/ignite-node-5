import { PaginationParams } from '@/core/repositories/pagination-params';
import { IQuestionCommentsRepository } from '@forum-repositories/question-comments-repository';
import { QuestionComment } from '@forum-entities/question-comment';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaQuestionCommentsRepository implements IQuestionCommentsRepository {
  create(comment: QuestionComment): Promise<void> {
    throw new Error('Method not implemented.');
  }
  delete(comment: QuestionComment): Promise<void> {
    throw new Error('Method not implemented.');
  }
  findById(questionCommentId: string): Promise<QuestionComment | null> {
    throw new Error('Method not implemented.');
  }
  findManyByQuestionId(questionId: string, params: PaginationParams): Promise<QuestionComment[]> {
    throw new Error('Method not implemented.');
  }
  
}