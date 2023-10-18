import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository';
import { DeleteAnswerCommentUseCase } from './delete-answer-comment';
import { makeAnswerComment } from 'test/factories/make-answer-comment';
import { ForbiddenError } from '@/core/errors/custom-errors';

let answerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: DeleteAnswerCommentUseCase;

describe('Delete comment on answer tests', () => {
  beforeEach(() => {
    answerCommentsRepository = new InMemoryAnswerCommentsRepository();
    sut = new DeleteAnswerCommentUseCase(answerCommentsRepository);
  });

  it('should be able to delete a comment on answer', async () => {
    const authorId = new UniqueEntityID();
    const commentId = new UniqueEntityID();

    const fakeComment = makeAnswerComment({
      authorId,
      answerId: new UniqueEntityID(),
      content: 'Comment content'
    }, commentId);
    await answerCommentsRepository.create(fakeComment);

    await sut.execute({
      authorId: authorId.toString(),
      commentId: commentId.toString(),
    });

    expect(answerCommentsRepository.items).toHaveLength(0);
  });

  it('should NOT be able to delete a comment on answer of another user', async () => {
    const authorId = new UniqueEntityID();
    const commentId = new UniqueEntityID();

    const fakeComment = makeAnswerComment({
      authorId,
      answerId: new UniqueEntityID(),
      content: 'Comment content'
    }, commentId);
    await answerCommentsRepository.create(fakeComment);

    const result = await sut.execute({
      authorId: 'unexistent-another-id',
      commentId: commentId.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ForbiddenError);
  });
});