import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { IStudentsRepository } from '../repositories/students-repository';
import { IHashComparer } from '../cryptography/hash-comparer';
import { IEncrypter } from '../cryptography/encrypter';
import { WrongCredentialsError } from '@/core/errors/custom-errors';

interface AuthenticateStudentUseCaseRequest {
  email: string;
  password: string;
}

type AuthenticateStudentUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string
  }
>;

@Injectable()
export class AuthenticateStudentUseCase {
  constructor(
    private studentsRepository: IStudentsRepository,
    private hasher: IHashComparer,
    private encrypter: IEncrypter
  ){}

  async execute({
    email,
    password
  }: AuthenticateStudentUseCaseRequest): Promise<AuthenticateStudentUseCaseResponse> {
    const student = await this.studentsRepository.findByEmail(email);

    if (!student) {
      return left(new WrongCredentialsError());
    }

    const isPasswordValid = await this.hasher.compare(password, student.password);

    if (!isPasswordValid) {
      return left(new WrongCredentialsError());
    }

    const accessToken = await this.encrypter.encrypt({
      sub: student.id.toString()
    });
    
    return right({ accessToken });
  }
}