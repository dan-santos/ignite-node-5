import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AttachmentFactory } from 'test/factories/make-attachment';
import { StudentFactory } from 'test/factories/make-student';

describe('[e2e] create question tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let attachmentFactory: AttachmentFactory;
  let jwt: JwtService;
  let studentFactory: StudentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, AttachmentFactory]
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);
    attachmentFactory = moduleRef.get(AttachmentFactory);
    studentFactory = moduleRef.get(StudentFactory);

    await app.init();
  });

  it('[POST] /questions', async () => {
    const user = await studentFactory.makeDatabaseStudent();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const attach1 = await attachmentFactory.makeDatabaseAttachment();
    const attach2 = await attachmentFactory.makeDatabaseAttachment();

    const response = await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Pergunta 1',
        content: 'Conteúdo da pergunta 1',
        authorId: user.id,
        attachments: [attach1.id.toString(), attach2.id.toString()]
      });

    const question = await prisma.question.findFirst({
      where: {
        title: 'Pergunta 1'
      },
    });

    const attachmentsOnDatabase = await prisma.attachment.findMany({
      where: {
        questionId: question?.id,
      }
    });

    expect(response.statusCode).toBe(201);
    expect(attachmentsOnDatabase).toHaveLength(2);
  });
});