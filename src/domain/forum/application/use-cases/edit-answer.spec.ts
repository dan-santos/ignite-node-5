import { makeAnswer } from 'test/factories/make-answer';
import { EditAnswerUseCase } from './edit-answer';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ForbiddenError } from '@/core/errors/custom-errors';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment';

let answerRepository: InMemoryAnswersRepository;
let attachmentsRepository: InMemoryAnswerAttachmentsRepository;
let sut: EditAnswerUseCase;

describe('Edit answer tests', () => {
  beforeEach(() => {
    attachmentsRepository = new InMemoryAnswerAttachmentsRepository();
    answerRepository = new InMemoryAnswersRepository(attachmentsRepository);
    sut = new EditAnswerUseCase(answerRepository, attachmentsRepository);
  });

  it('should be able to edit a answer', async () => {
    const answerId = new UniqueEntityID();
    const authorId = new UniqueEntityID();

    const fakeAnswer = makeAnswer({ authorId }, answerId);
    await answerRepository.create(fakeAnswer);

    attachmentsRepository.items.push(
      makeAnswerAttachment({
        answerId: fakeAnswer.id,
        attachmentId: new UniqueEntityID('1')
      }),
      makeAnswerAttachment({
        answerId: fakeAnswer.id,
        attachmentId: new UniqueEntityID('2')
      })
    );

    const result = await sut.execute({
      authorId: authorId.toString(),
      answerId: answerId.toString(),
      content: 'Edited content',
      attachmentsIds: ['1', '3']
    });
  
    expect(result.isRight()).toBe(true);
    expect(answerRepository.items[0].content).toEqual('Edited content');
    expect(answerRepository.items[0].attachments.currentItems).toHaveLength(2);
    expect(answerRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
    ]);
  });

  it('should NOT be able to edit a answer of another user', async () => {
    const answerId = new UniqueEntityID();
    const authorId = new UniqueEntityID();

    const fakeAnswer = makeAnswer({ authorId }, answerId);
    await answerRepository.create(fakeAnswer);

    const result = await sut.execute({
      authorId: 'inexistent-author-id',
      answerId: answerId.toString(),
      content: 'Edited content',
      attachmentsIds: [],
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ForbiddenError);
  });
});