import { BadRequestException, Controller, Get, HttpCode, Param, Query } from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { FetchAnswerCommentsUseCase } from '@forum-use-cases/fetch-answer-comments';
import { CommentWithAuthorPresenter } from '../presenters/comment-with-author-presenter';

@Controller('/answers/:answerId/comments/')
export class FetchAnswerCommentsController {
  constructor(
    private fetchAnswerComments: FetchAnswerCommentsUseCase
  ){}

  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('answerId') answerId: string,
    @Query('page') page: number
  ) {
    const result = await this.fetchAnswerComments.execute({ 
      answerId,
      page: page ?? 1
    });

    if (result.isLeft()) throw new BadRequestException();

    const comments = result.value.comments;

    return { comments: comments.map(CommentWithAuthorPresenter.toHttp) };
  }
}