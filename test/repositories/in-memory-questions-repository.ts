import { PaginationParams } from '@/core/repositories/pagination-params';
import { Question } from '@forum-entities/question';
import { IQuestionsRepository } from '@forum-repositories/questions-repository';
import { DomainEvents } from '@/core/events/domain-events';
import { InMemoryAttachmentsRepository } from './in-memory-attachments-repository';
import { InMemoryStudentsRepository } from './in-memory-students-repository';
import { InMemoryQuestionAttachmentsRepository } from './in-memory-question-attachments-repository';
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details';

export class InMemoryQuestionsRepository implements IQuestionsRepository {
  private questions: Question[] = [];

  constructor(
    private questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository,
    private attachmentsRepository: InMemoryAttachmentsRepository,
    private studentsRepository: InMemoryStudentsRepository
  ){}

  get items() {
    return [...this.questions];
  }

  async create(question: Question): Promise<void> {
    this.questions.push(question);

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getItems(),
    );

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async findBySlug(slug: string) {
    const question = this.questions.find(q => q.slug.content === slug);

    if (!question) return null;

    return question;
  }

  async findDetailsBySlug(slug: string) {
    const question = this.items.find(item => item.slug.content === slug);
    if (!question) return null;

    const author = this.studentsRepository.items.find((student) => {
      return student.id.equals(question.authorId);
    });
    if (!author) {
      throw new Error(`Author with id "${question.authorId}" doesnt exist`);
    }

    const questionAttachments = this.questionAttachmentsRepository.items.filter(
      (questionAttachment) => {
        return questionAttachment.questionId.equals(question.id);
      }
    );

    const attachments = questionAttachments.map((questionAttachment) => {
      const attachment = this.attachmentsRepository.items.find((attachment) => {
        return attachment.id.equals(questionAttachment.attachmentId);
      });

      if (!attachment) {
        throw new Error(`Attachment with id "${questionAttachment.attachmentId.toString()}" doesnt exist`);
      }

      return attachment;
    });

    return QuestionDetails.create({
      questionId: question.id,
      authorId: question.authorId,
      author: author.name,
      title: question.title,
      slug: question.slug,
      content: question.content,
      bestAnswerId: question.bestAnswerId,
      attachments,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt
    });
  }

  async findById(questionId: string){
    const question = this.questions.find(q => q.id.toString() === questionId);

    if (!question) return null;

    return question;
  }

  async delete(question: Question){
    const questionIndex = this.questions.findIndex(q => q.id === question.id);
    this.questions.splice(questionIndex, 1);
    this.questionAttachmentsRepository.deleteManyByQuestionId(question.id.toString());
  }

  async save(question: Question){
    const questionIndex = this.questions.findIndex(q => q.id === question.id);

    this.questions[questionIndex] = question;

    // add the new attachments and delete removed attachments
    await this.questionAttachmentsRepository.deleteMany(
      question.attachments.getRemovedItems(),
    );
    await this.questionAttachmentsRepository.createMany(
      question.attachments.getNewItems(),
    );

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async findManyRecent(params: PaginationParams){
    const { page } = params;
    const questions = this.questions
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20);

    return questions;
  }
}