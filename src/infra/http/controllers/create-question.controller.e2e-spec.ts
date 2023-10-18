import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';

describe('[e2e] create question tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  it('[POST] /questions', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'Fulano',
        email: 'f@mail.com',
        password: '123456',
      },
    });

    const accessToken = jwt.sign({ sub: user.id });

    const response = await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Pergunta 1',
        content: 'Conteúdo da pergunta 1',
        auhtorId: '1',
      });

    const question = await prisma.question.findFirst({
      where: {
        title: 'Pergunta 1'
      },
    });

    expect(response.statusCode).toBe(201);
    expect(question).toBeTruthy();
  });
});