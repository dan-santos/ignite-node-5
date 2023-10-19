import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Student, StudentProps } from '@forum-entities/student';

import { fakerPT_BR as faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaStudentMapper } from '@/infra/database/prisma/mappers/prisma-student-mapper';

export function makeStudent(
  override: Partial<StudentProps> = {},
  id?: UniqueEntityID,
) {
  const fakeStudent = Student.create({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    ...override,
  },
  id,
  );

  return fakeStudent;
}

@Injectable()
export class StudentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaStudent(data: Partial<StudentProps> = {}): Promise<Student> {
    const student = makeStudent(data);

    await this.prisma.user.create({
      data: PrismaStudentMapper.toDatabase(student),
    });

    return student;
  }
}