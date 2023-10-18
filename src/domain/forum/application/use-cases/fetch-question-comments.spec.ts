import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { FetchQuestionCommentsUseCase } from './fetch-question-comments';
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository';
import { makeQuestionComment } from 'test/factories/make-question-comment';

let repository: InMemoryQuestionCommentsRepository;
let sut: FetchQuestionCommentsUseCase;

describe('Fetch question comments tests', () => {
  beforeEach(() => {
    repository = new InMemoryQuestionCommentsRepository();
    sut = new FetchQuestionCommentsUseCase(repository);
  });

  it('should be able to fetch paginated question comments', async () => {
    const questionId = new UniqueEntityID();

    for (let i = 0; i < 22; i++) {
      await repository.create(makeQuestionComment({ questionId }));
    }
    
    const result = await sut.execute({ 
      questionId: questionId.toString(), page: 2 
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.comments).toHaveLength(2);
  });

  it('should be able to fetch question comments', async () => {
    const questionId = new UniqueEntityID();

    for (let i = 0; i < 4; i++) {
      await repository.create(makeQuestionComment({ questionId }));
    }
    
    const result = await sut.execute({ 
      questionId: questionId.toString(), page: 1 
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.comments).toHaveLength(4);
  });
});