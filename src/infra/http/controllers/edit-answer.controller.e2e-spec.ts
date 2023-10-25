import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AnswerFactory } from 'test/factories/make-answer';
import { AnswerAttachmentFactory } from 'test/factories/make-answer-attachment';
import { AttachmentFactory } from 'test/factories/make-attachment';
import { QuestionFactory } from 'test/factories/make-question';
import { StudentFactory } from 'test/factories/make-student';

describe('[e2e] edit answer tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;
  let studentFactory: StudentFactory;
  let answerFactory: AnswerFactory;
  let questionFactory: QuestionFactory;
  let attachmentsFactory: AttachmentFactory;
  let answerAttachmentFactory: AnswerAttachmentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory, 
        AnswerFactory, 
        QuestionFactory, 
        AttachmentFactory,
        AnswerAttachmentFactory
      ]
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);
    studentFactory = moduleRef.get(StudentFactory);
    answerFactory = moduleRef.get(AnswerFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    answerAttachmentFactory = moduleRef.get(AnswerAttachmentFactory);
    attachmentsFactory = moduleRef.get(AttachmentFactory);

    await app.init();
  });

  it('[PATCH] /answers/:id', async () => {
    const user = await studentFactory.makeDatabaseStudent();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const attach1 = await attachmentsFactory.makeDatabaseAttachment();
    const attach2 = await attachmentsFactory.makeDatabaseAttachment();

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id
    });

    const createdAnswer = await answerFactory.makePrismaAnswer({
      authorId: user.id,
      questionId: question.id
    });

    await answerAttachmentFactory.makeDatabaseAnswerAttachment({
      attachmentId: attach1.id,
      answerId: createdAnswer.id
    });
    await answerAttachmentFactory.makeDatabaseAnswerAttachment({
      attachmentId: attach2.id,
      answerId: createdAnswer.id
    });

    const attach3 = await attachmentsFactory.makeDatabaseAttachment();

    const response = await request(app.getHttpServer())
      .patch(`/answers/${createdAnswer.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        content: 'Conteúdo modificado',
        attachments: [attach1.id.toString(), attach3.id.toString()]
      });

    const answer = await prisma.answer.findFirst({
      where: {
        content: 'Conteúdo modificado'
      },
    });

    const attachmentsOnDatabase = await prisma.attachment.findMany({
      where: {
        answerId: answer?.id,
      }
    });

    expect(response.statusCode).toBe(204);
    expect(attachmentsOnDatabase).toHaveLength(2);
    expect(attachmentsOnDatabase).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: attach1.id.toString(),
        }),
        expect.objectContaining({
          id: attach3.id.toString(),
        }),
      ]),
    );
  });
});