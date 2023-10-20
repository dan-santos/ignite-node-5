import { Answer } from '@forum-entities/answer';

export class AnswerPresenter {
  static toHttp(answer: Answer) {
    return {
      id: answer.id.toString(),
      authorId: answer.authorId.toString(),
      createdAt: answer.createdAt,
      updatedAt: answer.updatedAt
    };
  }
}