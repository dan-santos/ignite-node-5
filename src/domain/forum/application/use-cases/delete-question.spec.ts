import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { makeQuestion } from 'test/factories/make-question';
import { DeleteQuestionUseCase } from './delete-question';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ForbiddenError } from '@/core/errors/custom-errors';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository';
import { makeQuestionAttachment } from 'test/factories/make-question-attachment';

let questionRepository: InMemoryQuestionsRepository;
let attachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: DeleteQuestionUseCase;

describe('Delete question tests', () => {
  beforeEach(() => {
    attachmentsRepository = new InMemoryQuestionAttachmentsRepository();
    questionRepository = new InMemoryQuestionsRepository(attachmentsRepository);
    sut = new DeleteQuestionUseCase(questionRepository);
  });

  it('should be able to delete a question', async () => {
    const questionId = new UniqueEntityID();
    const authorId = new UniqueEntityID();

    const fakeQuestion = makeQuestion({ authorId }, questionId);
    await questionRepository.create(fakeQuestion);

    attachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: fakeQuestion.id,
        attachmentId: new UniqueEntityID('1')
      }),
      makeQuestionAttachment({
        questionId: fakeQuestion.id,
        attachmentId: new UniqueEntityID('2')
      })
    );

    await sut.execute({
      questionId: questionId.toString(),
      authorId: authorId.toString()
    });

    expect(attachmentsRepository.items).toHaveLength(0);
    expect(questionRepository.items).toHaveLength(0);
  });

  it('should NOT be able to delete a question from another user', async () => {
    const questionId = new UniqueEntityID();
    const authorId = new UniqueEntityID();

    const fakeQuestion = makeQuestion({ authorId }, questionId);
    await questionRepository.create(fakeQuestion);

    const result = await sut.execute({
      questionId: questionId.toString(),
      authorId: 'unexistent-author-id'
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ForbiddenError);
  });
});