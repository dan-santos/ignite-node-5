import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AttachmentFactory } from 'test/factories/make-attachment';
import { QuestionFactory } from 'test/factories/make-question';
import { QuestionAttachmentFactory } from 'test/factories/make-question-attachment';
import { StudentFactory } from 'test/factories/make-student';

describe('[e2e] edit question tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let attachmentsFactory: AttachmentFactory;
  let questionAttachmentFactory: QuestionAttachmentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AttachmentFactory, QuestionAttachmentFactory]
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    attachmentsFactory = moduleRef.get(AttachmentFactory);
    questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory);

    await app.init();
  });

  it('[PATCH] /questions/:id', async () => {
    const user = await studentFactory.makeDatabaseStudent();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const attach1 = await attachmentsFactory.makeDatabaseAttachment();
    const attach2 = await attachmentsFactory.makeDatabaseAttachment();

    const createdQuestion = await questionFactory.makePrismaQuestion({
      authorId: user.id
    });

    await questionAttachmentFactory.makeDatabaseQuestionAttachment({
      attachmentId: attach1.id,
      questionId: createdQuestion.id
    });
    await questionAttachmentFactory.makeDatabaseQuestionAttachment({
      attachmentId: attach2.id,
      questionId: createdQuestion.id
    });

    const attach3 = await attachmentsFactory.makeDatabaseAttachment();

    const response = await request(app.getHttpServer())
      .patch(`/questions/${createdQuestion.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Título modificado',
        content: 'Conteúdo modificado',
        attachments: [attach1.id.toString(), attach3.id.toString()]
      });

    const question = await prisma.question.findFirst({
      where: {
        title: 'Título modificado'
      },
    });

    const attachmentsOnDatabase = await prisma.attachment.findMany({
      where: {
        questionId: question?.id,
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