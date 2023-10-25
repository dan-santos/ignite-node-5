import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AnswerFactory } from 'test/factories/make-answer';
import { AnswerCommentFactory } from 'test/factories/make-answer-comment';
import { QuestionFactory } from 'test/factories/make-question';
import { StudentFactory } from 'test/factories/make-student';

describe('[e2e] delete comment on answer tests', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let studentFactory: StudentFactory;
  let answerFactory: AnswerFactory;
  let questionFactory: QuestionFactory;
  let commentFactory: AnswerCommentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, AnswerFactory, AnswerCommentFactory, QuestionFactory]
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get(JwtService);
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    answerFactory = moduleRef.get(AnswerFactory);
    commentFactory = moduleRef.get(AnswerCommentFactory);

    await app.init();
  });

  it('[DELETE] /answers/comments/:id', async () => {
    const user = await studentFactory.makeDatabaseStudent();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const createdQuestion = await questionFactory.makePrismaQuestion({
      authorId: user.id
    });

    const createdAnswer = await answerFactory.makePrismaAnswer({
      authorId: user.id,
      questionId: createdQuestion.id
    });

    const createdComment = await commentFactory.makePrismaAnswerComment({
      authorId: user.id,
      answerId: createdAnswer.id
    });

    const response = await request(app.getHttpServer())
      .delete(`/answers/comments/${createdComment.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);
  });
});