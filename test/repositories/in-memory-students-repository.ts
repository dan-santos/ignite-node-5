import { IStudentsRepository } from '@forum-repositories/students-repository';
import { Student } from '@forum-entities/student';

export class InMemoryStudentsRepository implements IStudentsRepository {
  public items: Student[] = [];

  async create(student: Student): Promise<void> {
    this.items.push(student);
  }

  async delete(student: Student): Promise<void> {
    const studentIndex = this.items.findIndex(s => s.id === student.id);
    this.items.splice(studentIndex, 1);
  }

  async save(student: Student): Promise<void> {
    const studentIndex = this.items.findIndex(s => s.id === student.id);
    this.items[studentIndex] = student;
  }

  async findById(studentId: string): Promise<Student | null> {
    const student = this.items.find(s => s.id.toString() === studentId);

    if (!student) return null;

    return student;
  }
  async findByEmail(studentEmail: string): Promise<Student | null> {
    const student = this.items.find(s => s.email === studentEmail);

    if (!student) return null;
    
    return student;
  }
}