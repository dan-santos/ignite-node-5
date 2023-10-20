import { BadRequestException, Controller, Get, HttpCode, Param, Query } from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { FetchQuestionCommentsUseCase } from '@forum-use-cases/fetch-question-comments';
import { QuestionCommentPresenter } from '../presenters/question-comment-presenter';

@Controller('/questions/:questionId/comments/')
export class FetchQuestionCommentsController {
  constructor(
    private fetchQuestionComments: FetchQuestionCommentsUseCase
  ){}

  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('questionId') questionId: string,
    @Query('page') page: number
  ) {
    const result = await this.fetchQuestionComments.execute({ 
      questionId,
      page: page ?? 1
    });

    if (result.isLeft()) throw new BadRequestException();

    const comments = result.value.comments;

    return { comments: comments.map(QuestionCommentPresenter.toHttp) };
  }
}