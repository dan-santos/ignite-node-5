import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { GetQuestionBySlugUseCase } from './get-question-by-slug';
import { makeQuestion } from 'test/factories/make-question';
import { Slug } from '@forum-entities/value-objects/slug';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository';
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';
import { makeStudent } from 'test/factories/make-student';
import { makeAttachment } from 'test/factories/make-attachment';
import { makeQuestionAttachment } from 'test/factories/make-question-attachment';

let attachments: InMemoryAttachmentsRepository;
let studentsRepository: InMemoryStudentsRepository;
let questionAttachments: InMemoryQuestionAttachmentsRepository;
let repository: InMemoryQuestionsRepository;
let sut: GetQuestionBySlugUseCase;

describe('Get question by slug tests', () => {
  beforeEach(() => {
    attachments = new InMemoryAttachmentsRepository();
    studentsRepository = new InMemoryStudentsRepository();
    questionAttachments = new InMemoryQuestionAttachmentsRepository();
    repository = new InMemoryQuestionsRepository(
      questionAttachments, 
      attachments,
      studentsRepository
    );
    sut = new GetQuestionBySlugUseCase(repository);
  });

  it('should be able to create a question', async () => {
    const user = makeStudent({ name: 'joao' });
    studentsRepository.items.push(user);

    const fakeQuestion = makeQuestion({
      slug: Slug.create('example-question'),
      authorId: user.id
    });

    await repository.create(fakeQuestion);

    const attachment = makeAttachment({ title: 'new attachment' });

    attachments.items.push(attachment);

    questionAttachments.items.push(
      makeQuestionAttachment({
        attachmentId: attachment.id,
        questionId: fakeQuestion.id
      })
    );
    
    const result = await sut.execute({ 
      slug: 'example-question'
    });

    expect(result.isRight()).toBe(true);
    
    expect(result.value).toMatchObject({
      question: expect.objectContaining({
        title: fakeQuestion.title,
        author: user.name,
        attachments: [
          expect.objectContaining({ title: attachment.title })
        ]
      })
    });
  });
});