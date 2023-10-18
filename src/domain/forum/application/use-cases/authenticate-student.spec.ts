import { FakeHasher } from 'test/cryptography/fake-hasher';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';
import { WrongCredentialsError } from '@/core/errors/custom-errors';
import { FakeEncrypter } from 'test/cryptography/fake-encrypter';
import { AuthenticateStudentUseCase } from './authenticate-student';
import { makeStudent } from 'test/factories/make-student';

let repository: InMemoryStudentsRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
let sut: AuthenticateStudentUseCase;

describe('Register students tests', () => {
  beforeEach(() => {
    repository = new InMemoryStudentsRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();
    sut = new AuthenticateStudentUseCase(repository, fakeHasher, fakeEncrypter);
  });

  it('should be able to authenticate a student', async () => {
    await repository.create(
      makeStudent({
        email: 'j@mail.com',
        password: await fakeHasher.hash('123456')
      })
    );

    const result = await sut.execute({
      email: 'j@mail.com',
      password: '123456'
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    });
  });

  it('should NOT be able to authenticate a inexistent student', async () => {
    const result = await sut.execute({
      email: 'j@mail.com',
      password: '123456'
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(WrongCredentialsError);
  });

  it('should NOT be able to authenticate a student with wrong password', async () => {
    await repository.create(
      makeStudent({
        email: 'j@mail.com',
        password: await fakeHasher.hash('123456')
      })
    );

    const result = await sut.execute({
      email: 'j@mail.com',
      password: 'wrong-password'
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(WrongCredentialsError);
  });
});