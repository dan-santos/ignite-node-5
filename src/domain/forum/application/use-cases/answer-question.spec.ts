import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { AnswerQuestionUseCase } from './answer-question';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';

let answerRepository: InMemoryAnswersRepository;
let attachmentsRepository: InMemoryAnswerAttachmentsRepository;
let sut: AnswerQuestionUseCase;

describe('Answer question tests', () => {
  beforeEach(() => {
    attachmentsRepository = new InMemoryAnswerAttachmentsRepository();
    answerRepository = new InMemoryAnswersRepository(attachmentsRepository);
    sut = new AnswerQuestionUseCase(answerRepository);
  });

  it('should be able to asnwer a question', async () => {
    const result = await sut.execute({
      authorId: '1',
      questionId: '1',
      content: 'Não sei.',
      attachmentsIds: ['1', '2']
    });
  
    expect(result.isRight()).toBe(true);
    expect(answerRepository.items[0]).toEqual(result.value?.answer);
    expect(answerRepository.items[0].attachments.currentItems).toHaveLength(2);
    expect(answerRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
    ]);
  });
});