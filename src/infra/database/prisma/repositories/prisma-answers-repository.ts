import { PaginationParams } from '@/core/repositories/pagination-params';
import { IAnswersRepository } from '@forum-repositories/answers-repository';
import { Answer } from '@forum-entities/answer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaAnswersRepository implements IAnswersRepository {
  create(answer: Answer): Promise<void> {
    throw new Error('Method not implemented.');
  }
  delete(answer: Answer): Promise<void> {
    throw new Error('Method not implemented.');
  }
  save(answer: Answer): Promise<void> {
    throw new Error('Method not implemented.');
  }
  findById(answerId: string): Promise<Answer | null> {
    throw new Error('Method not implemented.');
  }
  findManyByQuestionId(questionId: string, params: PaginationParams): Promise<Answer[]> {
    throw new Error('Method not implemented.');
  }

}