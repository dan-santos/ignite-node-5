import { CommentWithAuthor } from '@forum-entities/value-objects/comment-with-author';

export class CommentWithAuthorPresenter {
  static toHttp(commentWithAuthor: CommentWithAuthor) {
    return {
      commentId: commentWithAuthor.commentId.toString(),
      authorId: commentWithAuthor.authorId.toString(),
      authorName: commentWithAuthor.author,
      content: commentWithAuthor.content,
      createdAt: commentWithAuthor.createdAt,
      updatedAt: commentWithAuthor.updatedAt
    };
  }
}