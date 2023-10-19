import { PaginationParams } from '@/core/repositories/pagination-params';
import { IQuestionCommentsRepository } from '@forum-repositories/question-comments-repository';
import { QuestionComment } from '@forum-entities/question-comment';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaQuestionCommentsMapper } from '../mappers/prisma-question-comments-mapper';

@Injectable()
export class PrismaQuestionCommentsRepository implements IQuestionCommentsRepository {
  constructor(private prisma: PrismaService){}

  async create(comment: QuestionComment): Promise<void> {
    const data = PrismaQuestionCommentsMapper.toDatabase(comment);

    await this.prisma.comment.create({
      data,
    });
  }
  
  async delete(comment: QuestionComment): Promise<void> {
    await this.prisma.comment.delete({
      where: {
        id: comment.id.toString(),
      },
    });
  }
  
  async findById(questionCommentId: string): Promise<QuestionComment | null> {
    const questionComment = await this.prisma.comment.findUnique({
      where: {
        id: questionCommentId,
      },
    });

    if (!questionComment) return null;

    return PrismaQuestionCommentsMapper.toDomain(questionComment);
  }

  async findManyByQuestionId(questionId: string, params: PaginationParams): Promise<QuestionComment[]> {
    const questionComments = await this.prisma.comment.findMany({
      where: {
        questionId,
      },
      take: 20,
      skip: (params.page - 1) * 20,
    });

    return questionComments.map(PrismaQuestionCommentsMapper.toDomain);
  }
  
}