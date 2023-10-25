import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { QuestionFactory } from 'test/factories/make-question';
import { StudentFactory } from 'test/factories/make-student';

describe('[e2e] fetch recent questions tests', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory]
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get(JwtService);
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);

    await app.init();
  });

  it('[GET] /questions', async () => {
    const user = await studentFactory.makeDatabaseStudent();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    await Promise.all([
      questionFactory.makePrismaQuestion(
        {
          title: 'Pergunta 1',
          authorId: user.id
        }
      ),
      questionFactory.makePrismaQuestion(
        {
          title: 'Pergunta 2',
          authorId: user.id
        }
      ),
    ]);

    const response = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      questions: expect.arrayContaining([
        expect.objectContaining({ title: 'Pergunta 2' }),
        expect.objectContaining({ title: 'Pergunta 1' }),
      ]),
    });
  });
});