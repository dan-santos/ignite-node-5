import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { FetchQuestionAnswersUseCase } from './fetch-question-answers';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { makeAnswer } from 'test/factories/make-answer';

let repository: InMemoryAnswersRepository;
let sut: FetchQuestionAnswersUseCase;

describe('Fetch question answers tests', () => {
  beforeEach(() => {
    repository = new InMemoryAnswersRepository();
    sut = new FetchQuestionAnswersUseCase(repository);
  });

  it('should be able to fetch paginated question answers', async () => {
    const questionId = new UniqueEntityID();

    for (let i = 0; i < 22; i++) {
      await repository.create(makeAnswer({ questionId }));
    }
    
    const result = await sut.execute({ 
      questionId: questionId.toString(), page: 2 
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.answers).toHaveLength(2);
  });

  it('should be able to fetch question answers', async () => {
    const questionId = new UniqueEntityID();

    for (let i = 0; i < 4; i++) {
      await repository.create(makeAnswer({ questionId }));
    }
    
    const result = await sut.execute({ 
      questionId: questionId.toString(), page: 1 
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.answers).toHaveLength(4);
  });
});