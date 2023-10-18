import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { makeQuestion } from 'test/factories/make-question';
import { FetchRecentQuestionsUseCase } from './fetch-recent-questions';

let repository: InMemoryQuestionsRepository;
let sut: FetchRecentQuestionsUseCase;

describe('Fetch recent questions tests', () => {
  beforeEach(() => {
    repository = new InMemoryQuestionsRepository();
    sut = new FetchRecentQuestionsUseCase(repository);
  });

  it('should be able to fetch paginated recent questions', async () => {
    for (let i = 1; i < 23; i++) {
      const question = makeQuestion({ title: `Question ${i}` });
      await repository.create(question);
    }
    
    const result = await sut.execute({ page: 2 });

    expect(result.isRight()).toBe(true);
    expect(result.value?.questions).toHaveLength(2);
  });

  it('should be able to fetch ordered recent questions', async () => {
    for (let i = 1; i < 4; i++) {
      const question = makeQuestion({ createdAt: new Date(2023, 9, i) });
      await repository.create(question);
    }
    
    const result = await sut.execute({ page: 1 });

    expect(result.isRight()).toBe(true);
    expect(result.value?.questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2023, 9, 3) }),
      expect.objectContaining({ createdAt: new Date(2023, 9, 2) }),
      expect.objectContaining({ createdAt: new Date(2023, 9, 1) }),
    ]);
  });
});