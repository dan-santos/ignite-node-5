import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { FetchQuestionCommentsUseCase } from './fetch-question-comments';
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository';
import { makeQuestionComment } from 'test/factories/make-question-comment';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';
import { makeStudent } from 'test/factories/make-student';

let studentsRepository: InMemoryStudentsRepository;
let repository: InMemoryQuestionCommentsRepository;
let sut: FetchQuestionCommentsUseCase;

describe('Fetch question comments tests', () => {
  beforeEach(() => {
    studentsRepository = new InMemoryStudentsRepository();
    repository = new InMemoryQuestionCommentsRepository(studentsRepository);
    sut = new FetchQuestionCommentsUseCase(repository);
  });

  it('should be able to fetch paginated question comments', async () => {
    const student = makeStudent();
    studentsRepository.items.push(student);

    const questionId = new UniqueEntityID();

    for (let i = 0; i < 22; i++) {
      await repository.create(makeQuestionComment({ 
        questionId,
        authorId: student.id
      }));
    }
    
    const result = await sut.execute({ 
      questionId: questionId.toString(), page: 2 
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.comments).toHaveLength(2);
  });

  it('should be able to fetch question comments', async () => {
    const student = makeStudent({ name: 'joao' });
    studentsRepository.items.push(student);

    const questionId = new UniqueEntityID();

    for (let i = 0; i < 4; i++) {
      await repository.create(makeQuestionComment({ 
        questionId,
        authorId: student.id
      }));
    }
    
    const result = await sut.execute({ 
      questionId: questionId.toString(), page: 1 
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