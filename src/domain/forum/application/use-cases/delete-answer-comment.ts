import { Either, left, right } from '@/core/either';
import { IAnswerCommentsRepository } from '@forum-repositories/answer-comments-repository';
import { ForbiddenError, ResourceNotFoundError } from '@/core/errors/custom-errors';

interface DeleteAnswerCommentUseCaseRequest {
  authorId: string;
  commentId: string;
}

type DeleteAnswerCommentUseCaseResponse = Either<ResourceNotFoundError | ForbiddenError, null>;

export class DeleteAnswerCommentUseCase {
  constructor(
    private answerCommentsRepository: IAnswerCommentsRepository
  ){}
  async execute({ 
    authorId, 
    commentId,
  }: DeleteAnswerCommentUseCaseRequest): Promise<DeleteAnswerCommentUseCaseResponse> {
    const comment = await this.answerCommentsRepository.findById(commentId);

    if (!comment) return left(new ResourceNotFoundError());

    if (comment.authorId.toString() !== authorId) return left(new ForbiddenError());

    await this.answerCommentsRepository.delete(comment);

    return right(null);
  }
}