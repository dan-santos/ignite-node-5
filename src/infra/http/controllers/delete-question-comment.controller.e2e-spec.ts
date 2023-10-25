import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { QuestionFactory } from 'test/factories/make-question';
import { QuestionCommentFactory } from 'test/factories/make-question-comment';
import { StudentFactory } from 'test/factories/make-student';

describe('[e2e] delete comment on question tests', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let commentFactory: QuestionCommentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, QuestionCommentFactory]
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get(JwtService);
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    commentFactory = moduleRef.get(QuestionCommentFactory);

    await app.init();
  });

  it('[DELETE] /questions/comments/:id', async () => {
    const user = await studentFactory.makeDatabaseStudent();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const createdQuestion = await questionFactory.makePrismaQuestion({
      authorId: user.id
    });

    const createdComment = await commentFactory.makePrismaQuestionComment({
      authorId: user.id,
      questionId: createdQuestion.id
    });

    const response = await request(app.getHttpServer())
      .delete(`/questions/comments/${createdComment.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);
  });
});