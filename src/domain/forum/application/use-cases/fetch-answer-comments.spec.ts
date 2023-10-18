import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments';
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository';
import { makeAnswerComment } from 'test/factories/make-answer-comment';

let repository: InMemoryAnswerCommentsRepository;
let sut: FetchAnswerCommentsUseCase;

describe('Fetch answer comments tests', () => {
  beforeEach(() => {
    repository = new InMemoryAnswerCommentsRepository();
    sut = new FetchAnswerCommentsUseCase(repository);
  });

  it('should be able to fetch paginated answer comments', async () => {
    const answerId = new UniqueEntityID();

    for (let i = 0; i < 22; i++) {
      await repository.create(makeAnswerComment({ answerId }));
    }
    
    const result = await sut.execute({ 
      answerId: answerId.toString(), page: 2 
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.comments).toHaveLength(2);
  });

  it('should be able to fetch answer comments', async () => {
    const answerId = new UniqueEntityID();

    for (let i = 0; i < 4; i++) {
      await repository.create(makeAnswerComment({ answerId }));
    }
    
    const result = await sut.execute({ 
      answerId: answerId.toString(), page: 1
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.comments).toHaveLength(4);
  });
});