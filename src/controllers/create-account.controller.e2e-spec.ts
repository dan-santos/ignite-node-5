import { AppModule } from '@/app.module';
import { PrismaService } from '@/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

describe('[e2e] create account tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  it('[POST] /accounts', async () => {
    const response = await request(app.getHttpServer()).post('/accounts').send({
      name: 'Fulano',
      email: 'f@mail.com',
      password: '123456',
    });

    const user = await prisma.user.findUnique({
      where: {
        email: 'f@mail.com'
      },
    });

    expect(response.statusCode).toBe(201);
    expect(user?.name).toEqual('Fulano');
  });
});