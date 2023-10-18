import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Student } from '@forum-entities/student';
import { Prisma, User as PrismaStudent } from '@prisma/client';

export class PrismaStudentMapper {
  static toDomain(raw: PrismaStudent): Student {
    return Student.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toDatabase(raw: Student): Prisma.UserUncheckedCreateInput {
    return {
      id: raw.id.toString(),
      name: raw.name,
      email: raw.email,
      password: raw.password,
      role: 'STUDENT'
    };
  }
}