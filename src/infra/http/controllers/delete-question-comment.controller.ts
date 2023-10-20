import { BadRequestException, Controller, Delete, HttpCode, Param } from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { DeleteQuestionCommentUseCase } from '@forum-use-cases/delete-question-comment';

@Controller('/questions/comments/:commentId')
export class DeleteQuestionCommentController {
  constructor(
    private deleteQuestionComment: DeleteQuestionCommentUseCase
  ){}

  @Delete()
  @HttpCode(200)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('commentId') commentId: string,
  ) {
    const userId = user.sub;

    const result = await this.deleteQuestionComment.execute({ 
      authorId: userId,
      commentId
    });

    if (result.isLeft()) throw new BadRequestException();
  }
}