import { makeQuestion } from 'test/factories/make-question';
import { EditQuestionUseCase } from './edit-question';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ForbiddenError } from '@/core/errors/custom-errors';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository';
import { makeQuestionAttachment } from 'test/factories/make-question-attachment';
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';

let attachments: InMemoryAttachmentsRepository;
let studentsRepository: InMemoryStudentsRepository;
let questionsRepository: InMemoryQuestionsRepository;
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: EditQuestionUseCase;

describe('Edit question tests', () => {
  beforeEach(() => {
    attachments = new InMemoryAttachmentsRepository();
    studentsRepository = new InMemoryStudentsRepository();
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
    questionsRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
      attachments,
      studentsRepository
    );
    sut = new EditQuestionUseCase(questionsRepository, questionAttachmentsRepository);
  });

  it('should be able to edit a question', async () => {
    const questionId = new UniqueEntityID();
    const authorId = new UniqueEntityID();

    const fakeQuestion = makeQuestion({ authorId }, questionId);
    await questionsRepository.create(fakeQuestion);

    questionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: fakeQuestion.id,
        attachmentId: new UniqueEntityID('1')
      }),
      makeQuestionAttachment({
        questionId: fakeQuestion.id,
        attachmentId: new UniqueEntityID('2')
      })
    );

    const result = await sut.execute({
      authorId: fakeQuestion.authorId.toString(),
      questionId: fakeQuestion.id.toString(),
      content: 'Edited content',
      title: fakeQuestion.title,
      attachmentsIds: ['1', '3']
    });
  
    expect(result.isRight()).toBe(true);
    expect(questionsRepository.items[0].content).toEqual('Edited content');
    expect(questionsRepository.items[0].attachments.currentItems).toHaveLength(2);
    expect(questionsRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
    ]);
  });

  it('should NOT be able to edit a question of another user', async () => {
    const questionId = new UniqueEntityID();
    const authorId = new UniqueEntityID();

    const fakeQuestion = makeQuestion({ authorId }, questionId);
    await questionsRepository.create(fakeQuestion);

    const result = await sut.execute({
      authorId: 'inexistent-author-id',
      questionId: questionId.toString(),
      content: 'Edited content',
      title: fakeQuestion.title,
      attachmentsIds: [],
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ForbiddenError);
  });

  it('should sync new and removed attachments when editing a question', async () => {
    const questionId = new UniqueEntityID();
    const authorId = new UniqueEntityID();

    const fakeQuestion = makeQuestion({ authorId }, questionId);
    await questionsRepository.create(fakeQuestion);

    questionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: fakeQuestion.id,
        attachmentId: new UniqueEntityID('1')
      }),
      makeQuestionAttachment({
        questionId: fakeQuestion.id,
        attachmentId: new UniqueEntityID('2')
      })
    );

    const result = await sut.execute({
      authorId: fakeQuestion.authorId.toString(),
      questionId: fakeQuestion.id.toString(),
      content: 'Edited content',
      title: fakeQuestion.title,
      attachmentsIds: ['1', '3', '4']
    });
  
    expect(result.isRight()).toBe(true);
    expect(questionAttachmentsRepository.items).toHaveLength(3);
  });
});