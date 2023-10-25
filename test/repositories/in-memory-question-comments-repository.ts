import { IQuestionCommentsRepository } from '@forum-repositories/question-comments-repository';
import { QuestionComment } from '@forum-entities/question-comment';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { InMemoryStudentsRepository } from './in-memory-students-repository';
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author';

export class InMemoryQuestionCommentsRepository implements IQuestionCommentsRepository {
  constructor(
    private studentsRepository: InMemoryStudentsRepository
  ){}
  
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

  async findManyByQuestionIdWithAuthor(questionId: string, params: PaginationParams){
    const { page } = params;
    const comments = this.comments
      .filter(comment => comment.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)
      .map(comment => {

        const author = this.studentsRepository.items.find(student => {
          return student.id.equals(comment.authorId);
        });

        if (!author) {
          throw new Error(`Author with id "${comment.authorId.toString()}" doesnt exist`);
        }

        return CommentWithAuthor.create({ 
          commentId: comment.id,
          authorId: comment.authorId,
          author: author.name,
          content: comment.content,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
        });
      });

    return comments;
  }
}