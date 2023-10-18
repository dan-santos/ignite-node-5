import { IStudentsRepository } from '@/domain/forum/application/repositories/students-repository';
import { Student } from '@/domain/forum/enterprise/entities/student';
import { PrismaService } from '../prisma.service';
import { PrismaStudentMapper } from '../mappers/prisma-student-mapper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaStudentsRepository implements IStudentsRepository {
  constructor(private prisma: PrismaService){}

  async create(student: Student): Promise<void> {
    const data = PrismaStudentMapper.toDatabase(student);

    await this.prisma.user.create({
      data,
    });
  }

  async delete(student: Student): Promise<void> {
    await this.prisma.user.delete({
      where: {
        id: student.id.toString(),
      },
    });
  }

  async save(student: Student): Promise<void> {
    const data = PrismaStudentMapper.toDatabase(student);

    await this.prisma.user.update({
      where: {
        id: data.id,
      },
      data,
    });
  }

  async findById(studentId: string): Promise<Student | null> {
    const student = await this.prisma.user.findUnique({
      where: {
        id: studentId,
      },
    });

    if (!student) return null;

    return PrismaStudentMapper.toDomain(student);
  }
  
  async findByEmail(studentEmail: string): Promise<Student | null> {
    const student = await this.prisma.user.findUnique({
      where: {
        email: studentEmail,
      },
    });

    if (!student) return null;

    return PrismaStudentMapper.toDomain(student);
  }
  
}