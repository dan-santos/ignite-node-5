import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { makeAnswer } from 'test/factories/make-answer';
import { DeleteAnswerUseCase } from './delete-answer';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ForbiddenError } from '@/core/errors/custom-errors';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment';

let answerRepository: InMemoryAnswersRepository;
let attachmentsRepository: InMemoryAnswerAttachmentsRepository;
let sut: DeleteAnswerUseCase;

describe('Delete answer tests', () => {
  beforeEach(() => {
    attachmentsRepository = new InMemoryAnswerAttachmentsRepository();
    answerRepository = new InMemoryAnswersRepository(attachmentsRepository);
    sut = new DeleteAnswerUseCase(answerRepository);
  });

  it('should be able to delete a answer', async () => {
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

    await sut.execute({
      answerId: answerId.toString(),
      authorId: authorId.toString()
    });

    expect(answerRepository.items).toHaveLength(0);
    expect(attachmentsRepository.items).toHaveLength(0);
  });

  it('should NOT be able to delete a answer from another user', async () => {
    const answerId = new UniqueEntityID();
    const authorId = new UniqueEntityID();

    const fakeAnswer = makeAnswer({ authorId }, answerId);
    await answerRepository.create(fakeAnswer);

    const result = await sut.execute({
      answerId: answerId.toString(),
      authorId: 'unexistent-author-id'
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ForbiddenError);
  });
});