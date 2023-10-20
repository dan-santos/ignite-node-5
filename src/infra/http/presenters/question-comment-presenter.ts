import { QuestionComment } from '@forum-entities/question-comment';

export class QuestionCommentPresenter {
  static toHttp(questionComment: QuestionComment) {
    return {
      id: questionComment.id.toString(),
      authorId: questionComment.authorId.toString(),
      questionId: questionComment.questionId.toString(),
      content: questionComment.content
    };
  }
}