import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments';
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository';
import { makeAnswerComment } from 'test/factories/make-answer-comment';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';
import { makeStudent } from 'test/factories/make-student';

let studentsRepository: InMemoryStudentsRepository;
let repository: InMemoryAnswerCommentsRepository;
let sut: FetchAnswerCommentsUseCase;

describe('Fetch answer comments tests', () => {
  beforeEach(() => {
    studentsRepository = new InMemoryStudentsRepository();
    repository = new InMemoryAnswerCommentsRepository(studentsRepository);
    sut = new FetchAnswerCommentsUseCase(repository);
  });

  it('should be able to fetch paginated answer comments', async () => {
    const student = makeStudent({ name: 'joao' });
    studentsRepository.items.push(student);

    const answerId = new UniqueEntityID();

    for (let i = 0; i < 22; i++) {
      await repository.create(makeAnswerComment({ 
        answerId,
        authorId: student.id
      }));
    }
    
    const result = await sut.execute({ 
      answerId: answerId.toString(), page: 2 
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.comments).toHaveLength(2);
  });

  it('should be able to fetch answer comments', async () => {
    const student = makeStudent({ name: 'joao' });
    studentsRepository.items.push(student);

    const answerId = new UniqueEntityID();

    for (let i = 0; i < 4; i++) {
      await repository.create(makeAnswerComment({ 
        answerId,
        authorId: student.id
      }));
    }
    
    const result = await sut.execute({ 
      answerId: answerId.toString(), page: 1
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.comments).toHaveLength(4);
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          author: 'joao'
        }),
      ]),
    );
  });
});