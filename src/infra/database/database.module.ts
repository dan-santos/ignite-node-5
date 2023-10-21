import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaAnswerAttachmentsRepository } from '@prisma-repositories/prisma-answer-attachments-repository';
import { PrismaAnswerCommentsRepository } from '@prisma-repositories/prisma-answer-comments-repository';
import { PrismaAnswersRepository } from '@prisma-repositories/prisma-answers-repository';
import { PrismaQuestionAttachmentsRepository } from '@prisma-repositories/prisma-question-attachments-repository';
import { PrismaQuestionCommentsRepository } from '@prisma-repositories/prisma-question-comments-repository';
import { PrismaQuestionsRepository } from '@prisma-repositories/prisma-questions-repository';
import { IQuestionsRepository } from '@forum-repositories/questions-repository';
import { IStudentsRepository } from '@forum-repositories/students-repository';
import { PrismaStudentsRepository } from '@prisma-repositories/prisma-students-repository';
import { IAnswerAttachmentsRepository } from '@forum-repositories/answer-attachments-repository';
import { IAnswerCommentsRepository } from '@forum-repositories/answer-comments-repository';
import { IAnswersRepository } from '@forum-repositories/answers-repository';
import { IQuestionCommentsRepository } from '@forum-repositories/question-comments-repository';
import { IQuestionAttachmentsRepository } from '@forum-repositories/question-attachments-repository';
import { IAttachmentsRepository } from '@/domain/forum/application/repositories/attachments-repository';
import { PrismaAttachmentsRepository } from './prisma/repositories/prisma-attachments-repository';

@Module({
  providers: [
    PrismaService,
    { provide: IAnswerAttachmentsRepository, useClass: PrismaAnswerAttachmentsRepository },
    { provide: IAnswerCommentsRepository, useClass: PrismaAnswerCommentsRepository },
    { provide: IAnswersRepository, useClass: PrismaAnswersRepository },
    { provide: IQuestionAttachmentsRepository, useClass: PrismaQuestionAttachmentsRepository },
    { provide: IQuestionCommentsRepository, useClass: PrismaQuestionCommentsRepository },
    { provide: IQuestionsRepository, useClass: PrismaQuestionsRepository },
    { provide: IStudentsRepository, useClass: PrismaStudentsRepository },
    { provide: IAttachmentsRepository, useClass: PrismaAttachmentsRepository }
  ],
  exports: [
    PrismaService,
    IAnswerAttachmentsRepository,
    IAnswerCommentsRepository,
    IAnswersRepository,
    IQuestionAttachmentsRepository,
    IQuestionCommentsRepository,
    IQuestionsRepository,
    IStudentsRepository,
    IAttachmentsRepository
  ]
})
export class DatabaseModule {}