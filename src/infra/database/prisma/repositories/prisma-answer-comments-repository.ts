import { PaginationParams } from '@/core/repositories/pagination-params';
import { IAnswerCommentsRepository } from '@forum-repositories/answer-comments-repository';
import { AnswerComment } from '@forum-entities/answer-comment';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaAnswerCommentsMapper } from '../mappers/prisma-answer-comments-mapper';

@Injectable()
export class PrismaAnswerCommentsRepository implements IAnswerCommentsRepository {
  constructor(private prisma: PrismaService){}

  async create(comment: AnswerComment): Promise<void> {
    const data = PrismaAnswerCommentsMapper.toDatabase(comment);

    await this.prisma.comment.create({
      data,
    });
  }
  
  async delete(comment: AnswerComment): Promise<void> {
    await this.prisma.comment.delete({
      where: {
        id: comment.id.toString(),
      },
    });
  }
  
  async findById(answerCommentId: string): Promise<AnswerComment | null> {
    const answerComment = await this.prisma.comment.findUnique({
      where: {
        id: answerCommentId,
      },
    });

    if (!answerComment) return null;

    return PrismaAnswerCommentsMapper.toDomain(answerComment);
  }

  async findManyByAnswerId(answerId: string, params: PaginationParams): Promise<AnswerComment[]> {
    const answerComments = await this.prisma.comment.findMany({
      where: {
        answerId,
      },
      take: 20,
      skip: (params.page - 1) * 20,
    });

    return answerComments.map(PrismaAnswerCommentsMapper.toDomain);
  }
  
}