import { QuestionDetails } from '@forum-entities/value-objects/question-details';
import { AttachmentPresenter } from './attachment-presenter';

export class QuestionDetailsPresenter {
  static toHttp(questionDetails: QuestionDetails) {
    return {
      questionId: questionDetails.questionId.toString(),
      authorId: questionDetails.authorId.toString(),
      author: questionDetails.author,
      content: questionDetails.content,
      title: questionDetails.title,
      slug: questionDetails.slug.content,
      bestAnswerId: questionDetails.bestAnswerId?.toString(),
      createdAt: questionDetails.createdAt,
      updatedAt: questionDetails.updatedAt,
      attachments: questionDetails.attachments.map(AttachmentPresenter.toHttp)
    };
  }
}