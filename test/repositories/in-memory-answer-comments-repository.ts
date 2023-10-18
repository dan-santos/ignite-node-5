import { IAnswerCommentsRepository } from '@forum-repositories/answer-comments-repository';
import { AnswerComment } from '@forum-entities/answer-comment';
import { PaginationParams } from '@/core/repositories/pagination-params';

export class InMemoryAnswerCommentsRepository implements IAnswerCommentsRepository {
  private comments: AnswerComment[] = [];
  get items() {
    return [...this.comments];
  }

  async create(comment: AnswerComment){
    this.comments.push(comment);
  }

  async delete(comment: AnswerComment){
    const commentIndex = this.comments.findIndex(item => item.id === comment.id);
    this.comments.splice(commentIndex, 1);
  }

  async findById(answerCommentId: string){
    const comment = this.comments.find(item => item.id.toString() === answerCommentId);

    if (!comment) return null;

    return comment;
  }

  async findManyByAnswerId(answerId: string, params: PaginationParams){
    const { page } = params;
    const comments = this.comments
      .filter(comment => comment.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20);

    return comments;
  }
}