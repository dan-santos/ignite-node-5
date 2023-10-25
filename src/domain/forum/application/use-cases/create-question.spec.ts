import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { CreateQuestionUseCase } from './create-question';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository';
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';

let attachments: InMemoryAttachmentsRepository;
let studentsRepository: InMemoryStudentsRepository;
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let questionRepository: InMemoryQuestionsRepository;
let sut: CreateQuestionUseCase;

describe('Create question tests', () => {
  beforeEach(() => {
    attachments = new InMemoryAttachmentsRepository();
    studentsRepository = new InMemoryStudentsRepository();
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
    questionRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository, 
      attachments, 
      studentsRepository
    );
    sut = new CreateQuestionUseCase(questionRepository);
  });

  it('should be able to create a question', async () => {
    const result = await sut.execute({
      authorId: '1',
      title: 'Pergunta?',
      content: 'Não sei.',
      attachmentsIds: ['1', '2'],
    });
  
    expect(result.isRight()).toBe(true);
    expect(questionRepository.items[0]).toEqual(result.value?.question);
    expect(questionRepository.items[0].attachments.currentItems).toHaveLength(2);
    expect(questionRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
    ]);
  });

  it('should persist attachments when creating a new question', async () => {
    const result = await sut.execute({
      authorId: '1',
      title: 'Pergunta?',
      content: 'Não sei.',
      attachmentsIds: ['1', '2'],
    });
  
    expect(result.isRight()).toBe(true);
    expect(questionAttachmentsRepository.items).toHaveLength(2);
    expect(questionAttachmentsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachmentId: new UniqueEntityID('1')
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityID('2')
        }),
      ]),
    );
  });
});