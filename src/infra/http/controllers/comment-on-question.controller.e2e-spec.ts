import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { QuestionFactory } from 'test/factories/make-question';
import { QuestionCommentFactory } from 'test/factories/make-question-comment';
import { StudentFactory } from 'test/factories/make-student';

describe('[e2e] comment on question tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
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
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    commentFactory = moduleRef.get(QuestionCommentFactory);

    await app.init();
  });

  it('[POST] /questions/:questionId/comments', async () => {
    const user = await studentFactory.makeDatabaseStudent();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const createdQuestion = await questionFactory.makePrismaQuestion({
      authorId: user.id
    });

    await commentFactory.makePrismaQuestionComment({
      authorId: user.id,
      questionId: createdQuestion.id
    });

    const response = await request(app.getHttpServer())
      .post(`/questions/${createdQuestion.id.toString()}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        content: 'Comentário na pergunta'
      });

    const comment = await prisma.comment.findFirst({
      where: {
        questionId: createdQuestion.id.toString(),
      },
    });

    expect(response.statusCode).toBe(201);
    expect(comment).toBeTruthy();
  });
});