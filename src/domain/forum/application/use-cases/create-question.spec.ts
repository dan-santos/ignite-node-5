import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { CreateQuestionUseCase } from './create-question';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository';

let attachmentsRepository: InMemoryQuestionAttachmentsRepository;
let questionRepository: InMemoryQuestionsRepository;
let sut: CreateQuestionUseCase;

describe('Create question tests', () => {
  beforeEach(() => {
    attachmentsRepository = new InMemoryQuestionAttachmentsRepository();
    questionRepository = new InMemoryQuestionsRepository(attachmentsRepository);
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
});