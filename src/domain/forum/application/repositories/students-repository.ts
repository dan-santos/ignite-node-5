import { Student } from '@forum-entities/student';

export abstract class IStudentsRepository {
  abstract create(student: Student): Promise<void>;
  abstract delete(student: Student): Promise<void>;
  abstract save(student: Student): Promise<void>;
  abstract findById(studentId: string): Promise<Student | null>;
  abstract findByEmail(studentEmail: string): Promise<Student | null>;
}