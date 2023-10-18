import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaAnswerAttachmentsRepository } from '@prisma-repositories/prisma-answer-attachments-repository';
import { PrismaAnswerCommentsRepository } from '@prisma-repositories/prisma-answer-comments-repository';
import { PrismaAnswersRepository } from '@prisma-repositories/prisma-answers-repository';
import { PrismaQuestionAttachmentsRepository } from '@prisma-repositories/prisma-question-attachments-repository';
import { PrismaQuestionCommentsRepository } from '@prisma-repositories/prisma-question-comments-repository';
import { PrismaQuestionsRepository } from '@prisma-repositories/prisma-questions-repository';
import { IQuestionsRepository } from '@forum-repositories/questions-repository';
import { IStudentsRepository } from '@/domain/forum/application/repositories/students-repository';
import { PrismaStudentsRepository } from './prisma/repositories/prisma-students-repository';

@Module({
  providers: [
    PrismaService,
    PrismaAnswerAttachmentsRepository,
    PrismaAnswerCommentsRepository,
    PrismaAnswersRepository,
    PrismaQuestionAttachmentsRepository,
    PrismaQuestionCommentsRepository,
    { provide: IQuestionsRepository, useClass: PrismaQuestionsRepository },
    { provide: IStudentsRepository, useClass: PrismaStudentsRepository }
  ],
  exports: [
    PrismaService,
    PrismaAnswerAttachmentsRepository,
    PrismaAnswerCommentsRepository,
    PrismaAnswersRepository,
    PrismaQuestionAttachmentsRepository,
    PrismaQuestionCommentsRepository,
    IQuestionsRepository,
    IStudentsRepository
  ]
})
export class DatabaseModule {}