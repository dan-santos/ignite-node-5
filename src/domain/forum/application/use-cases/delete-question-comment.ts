import { Either, left, right } from '@/core/either';
import { IQuestionCommentsRepository } from '@forum-repositories/question-comments-repository';
import { ForbiddenError, ResourceNotFoundError } from '@/core/errors/custom-errors';

interface DeleteQuestionCommentUseCaseRequest {
  authorId: string;
  commentId: string;
}

type DeleteQuestionCommentUseCaseResponse = Either<ResourceNotFoundError | ForbiddenError, null>

export class DeleteQuestionCommentUseCase {
  constructor(
    private questionCommentsRepository: IQuestionCommentsRepository
  ){}
  async execute({ 
    authorId, 
    commentId,
  }: DeleteQuestionCommentUseCaseRequest): Promise<DeleteQuestionCommentUseCaseResponse> {
    const comment = await this.questionCommentsRepository.findById(commentId);

    if (!comment) return left(new ResourceNotFoundError());

    if (comment.authorId.toString() !== authorId){
      return left(new ForbiddenError());
    }

    await this.questionCommentsRepository.delete(comment);

    return right(null);
  }
}