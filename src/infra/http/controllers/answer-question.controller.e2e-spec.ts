import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AttachmentFactory } from 'test/factories/make-attachment';
import { QuestionFactory } from 'test/factories/make-question';
import { StudentFactory } from 'test/factories/make-student';

describe('[e2e] answer question tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let attachmentFactory: AttachmentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AttachmentFactory]
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    attachmentFactory = moduleRef.get(AttachmentFactory);

    await app.init();
  });

  it('[POST] /questions/:questionId/answers', async () => {
    const user = await studentFactory.makeDatabaseStudent();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const createdQuestion = await questionFactory.makePrismaQuestion({
      authorId: user.id
    });

    const attach1 = await attachmentFactory.makeDatabaseAttachment();
    const attach2 = await attachmentFactory.makeDatabaseAttachment();

    const response = await request(app.getHttpServer())
      .post(`/questions/${createdQuestion.id.toString()}/answers`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        content: 'Resposta para a pergunta',
        attachments: [
          attach1.id.toString(),
          attach2.id.toString(),
        ]
      });

    const answer = await prisma.answer.findFirst({
      where: {
        questionId: createdQuestion.id.toString(),
      },
    });

    const attachmentsOnDatabase = await prisma.attachment.findMany({
      where: {
        answerId: answer?.id,
      }
    });

    expect(response.statusCode).toBe(201);
    expect(attachmentsOnDatabase).toHaveLength(2);
  });
});