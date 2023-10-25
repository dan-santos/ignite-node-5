import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug';
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AttachmentFactory } from 'test/factories/make-attachment';
import { QuestionFactory } from 'test/factories/make-question';
import { QuestionAttachmentFactory } from 'test/factories/make-question-attachment';
import { StudentFactory } from 'test/factories/make-student';

describe('[e2e] get question by slug tests', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let attachmentFactory: AttachmentFactory;
  let questionAttachmentFactory: QuestionAttachmentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, QuestionAttachmentFactory, AttachmentFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get(JwtService);
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    attachmentFactory = moduleRef.get(AttachmentFactory);
    questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory);

    await app.init();
  });

  it('[GET] /questions:slug', async () => {
    const user = await studentFactory.makeDatabaseStudent({ name: 'joao' });

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion(
      {
        title: 'Pergunta 1',
        slug: Slug.create('pergunta-1'),
        authorId: user.id
      }
    );

    const attachment = await attachmentFactory.makeDatabaseAttachment({
      title: 'new attachment'
    });

    await questionAttachmentFactory.makeDatabaseQuestionAttachment({
      attachmentId: attachment.id,
      questionId: question.id
    });

    const response = await request(app.getHttpServer())
      .get('/questions/pergunta-1')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      question: expect.objectContaining({ 
        title: 'Pergunta 1',
        author: user.name,
        attachments: [
          expect.objectContaining({ title: attachment.title })
        ] 
      }),
    });
  });
});