import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { QuestionCommentFactory } from 'test/factories/make-question-comment';
import { QuestionFactory } from 'test/factories/make-question';
import { StudentFactory } from 'test/factories/make-student';

describe('[e2e] fetch question comments tests', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let questionCommentFactory: QuestionCommentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, QuestionCommentFactory]
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get(JwtService);
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    questionCommentFactory = moduleRef.get(QuestionCommentFactory);

    await app.init();
  });

  it('[GET] /questions/:questionId/comments', async () => {
    const user = await studentFactory.makeDatabaseStudent({ name: 'joao' });

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id
    });

    const comment = await questionCommentFactory.makePrismaQuestionComment({
      authorId: user.id,
      questionId: question.id,
    });

    const response = await request(app.getHttpServer())
      .get(`/questions/${question.id.toString()}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);

    expect(response.body).toEqual({
      comments: expect.arrayContaining([
        expect.objectContaining({ commentId: comment.id.toString(), authorName: user.name }),
      ]),
    });
  });
});