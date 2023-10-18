import { PaginationParams } from '@/core/repositories/pagination-params';
import { IAnswerAttachmentsRepository } from '@forum-repositories/answer-attachments-repository';
import { Answer } from '@forum-entities/answer';
import { IAnswersRepository } from '@forum-repositories/answers-repository';
import { DomainEvents } from '@/core/events/domain-events';

export class InMemoryAnswersRepository implements IAnswersRepository {
  private answers: Answer[] = [];

  constructor(
    private answerAttachmentsRepository?: IAnswerAttachmentsRepository
  ){}
  
  get items() {
    return [...this.answers];
  }

  async create(answer: Answer): Promise<void> {
    this.answers.push(answer);
    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async findById(answerId: string){
    const answer = this.answers.find(q => q.id.toString() === answerId);

    if (!answer) return null;

    return answer;
  }

  async delete(answer: Answer){
    const answerIndex = this.answers.findIndex(q => q.id === answer.id);
    this.answers.splice(answerIndex, 1);
    this.answerAttachmentsRepository?.deleteManyByAnswerId(answer.id.toString());
  }

  async save(answer: Answer){
    const answerIndex = this.answers.findIndex(q => q.id === answer.id);

    this.answers[answerIndex] = answer;
    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async findManyByQuestionId(questionId: string, params: PaginationParams): Promise<Answer[]> {
    const { page } = params;
    const answers = this.answers
      .filter(answer => answer.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20);

    return answers;
  }
}