import { IQuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { AppModule } from '@/infra/app.module';
import { ICacheRepository } from '@/infra/cache/cache-repository';
import { CacheModule } from '@/infra/cache/cache.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AttachmentFactory } from 'test/factories/make-attachment';
import { QuestionFactory } from 'test/factories/make-question';
import { QuestionAttachmentFactory } from 'test/factories/make-question-attachment';
import { StudentFactory } from 'test/factories/make-student';

describe('[e2e] cache in questions repository tests', () => {
  let app: INestApplication;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let attachmentFactory: AttachmentFactory;
  let questionAttachmentFactory: QuestionAttachmentFactory;
  let cacheRepository: ICacheRepository;
  let questionsRepository: IQuestionsRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CacheModule],
      providers: [
        StudentFactory, 
        QuestionFactory, 
        QuestionAttachmentFactory, 
        AttachmentFactory
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    attachmentFactory = moduleRef.get(AttachmentFactory);
    questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory);
    cacheRepository = moduleRef.get(ICacheRepository);
    questionsRepository = moduleRef.get(IQuestionsRepository);

    await app.init();
  });

  it('cache question details', async () => {
    const user = await studentFactory.makeDatabaseStudent();

    const question = await questionFactory.makePrismaQuestion(
      {
        authorId: user.id
      }
    );

    const attachment = await attachmentFactory.makeDatabaseAttachment();

    await questionAttachmentFactory.makeDatabaseQuestionAttachment({
      attachmentId: attachment.id,
      questionId: question.id
    });

    const slug = question.slug.content;

    const questionDetails = await questionsRepository.findDetailsBySlug(slug);

    const cached = await cacheRepository.get(`question:${slug}:details`);

    expect(cached).toEqual(JSON.stringify(questionDetails));
  });

  it('should return cached question details on subsequent calls', async () => {
    const user = await studentFactory.makeDatabaseStudent();

    const question = await questionFactory.makePrismaQuestion(
      {
        authorId: user.id
      }
    );

    const attachment = await attachmentFactory.makeDatabaseAttachment();

    await questionAttachmentFactory.makeDatabaseQuestionAttachment({
      attachmentId: attachment.id,
      questionId: question.id
    });

    const slug = question.slug.content;

    await cacheRepository.set(`question:${slug}:details`, JSON.stringify({ empty: true }));

    const questionDetails = await questionsRepository.findDetailsBySlug(slug);

    expect(questionDetails).toEqual({ empty: true });
  });

  it('should reset questions details cache when saving the question', async () => {
    const user = await studentFactory.makeDatabaseStudent();

    const question = await questionFactory.makePrismaQuestion(
      {
        authorId: user.id
      }
    );

    const attachment = await attachmentFactory.makeDatabaseAttachment();

    await questionAttachmentFactory.makeDatabaseQuestionAttachment({
      attachmentId: attachment.id,
      questionId: question.id
    });

    const slug = question.slug.content;

    await cacheRepository.set(`question:${slug}:details`, JSON.stringify({ empty: true }));

    await questionsRepository.save(question);

    const cached = await cacheRepository.get(`question:${slug}:details`);

    expect(cached).toBeNull();
  });
});