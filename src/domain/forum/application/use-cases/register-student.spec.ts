import { FakeHasher } from 'test/cryptography/fake-hasher';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';
import { RegisterStudentUseCase } from './register-student';
import { ConflictError } from '@/core/errors/custom-errors';

let repository: InMemoryStudentsRepository;
let fakeHasher: FakeHasher;
let sut: RegisterStudentUseCase;

describe('Register students tests', () => {
  beforeEach(() => {
    repository = new InMemoryStudentsRepository();
    fakeHasher = new FakeHasher();
    sut = new RegisterStudentUseCase(repository, fakeHasher);
  });

  it('should be able to register a new student', async () => {
    const result = await sut.execute({
      name: 'joao',
      email: 'j@mail.com',
      password: '123456'
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      student: repository.items[0],
    });
  });

  it('should hash student password upon registration', async () => {
    const result = await sut.execute({
      name: 'joao',
      email: 'j@mail.com',
      password: '123456'
    });

    const hashedPassword = await fakeHasher.hash('123456');

    expect(result.isRight()).toBe(true);
    expect(repository.items[0].password).toEqual(hashedPassword);
  });

  it('should NOT be able to register a new student with already existent email', async () => {
    await sut.execute({
      name: 'joao',
      email: 'j@mail.com',
      password: '123456'
    });

    const result = await sut.execute({
      name: 'joao',
      email: 'j@mail.com',
      password: '123456'
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ConflictError);
  });
});