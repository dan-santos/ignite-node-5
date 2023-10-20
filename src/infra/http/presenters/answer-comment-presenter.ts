import { AnswerComment } from '@forum-entities/answer-comment';

export class AnswerCommentPresenter {
  static toHttp(answerComment: AnswerComment) {
    return {
      id: answerComment.id.toString(),
      authorId: answerComment.authorId.toString(),
      answerId: answerComment.answerId.toString(),
      content: answerComment.content
    };
  }
}