import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { Student } from '@forum-entities/student';
import { IStudentsRepository } from '../repositories/students-repository';
import { IHashGenerator } from '../cryptography/hash-generator';
import { ConflictError } from '@/core/errors/custom-errors';

interface RegisterStudentUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

type RegisterStudentUseCaseResponse = Either<
  ConflictError,
  {
    student: Student
  }
>;

@Injectable()
export class RegisterStudentUseCase {
  constructor(
    private studentsRepository: IStudentsRepository,
    private hasher: IHashGenerator
  ){}

  async execute({
    name,
    email,
    password
  }: RegisterStudentUseCaseRequest): Promise<RegisterStudentUseCaseResponse> {
    const emailAlreadyExists = await this.studentsRepository.findByEmail(email);

    if (emailAlreadyExists) {
      return left(new ConflictError());
    }

    const student = Student.create({ 
      name, 
      email, 
      password: await this.hasher.hash(password)
    });

    await this.studentsRepository.create(student);
    
    return right({ student });
  }
}