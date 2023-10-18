import { IQuestionCommentsRepository } from '@forum-repositories/question-comments-repository';
import { QuestionComment } from '@forum-entities/question-comment';
import { PaginationParams } from '@/core/repositories/pagination-params';

export class InMemoryQuestionCommentsRepository implements IQuestionCommentsRepository {
  private comments: QuestionComment[] = [];
  get items() {
    return [...this.comments];
  }

  async create(comment: QuestionComment){
    this.comments.push(comment);
  }
  
  async delete(comment: QuestionComment){
    const commentIndex = this.comments.findIndex(item => item.id === comment.id);
    this.comments.splice(commentIndex, 1);
  }
  
  async findById(questionCommentId: string){
    const comment = this.comments.find(item => item.id.toString() === questionCommentId);

    if (!comment) return null;

    return comment;
  }

  async findManyByQuestionId(questionId: string, params: PaginationParams){
    const { page } = params;
    const comments = this.comments
      .filter(comment => comment.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20);

    return comments;
  }
}