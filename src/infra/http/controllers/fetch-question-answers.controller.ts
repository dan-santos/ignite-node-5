import { BadRequestException, Controller, Get, HttpCode, Param, Query } from '@nestjs/common';
import { FetchQuestionAnswersUseCase } from '@forum-use-cases/fetch-question-answers';
import { AnswerPresenter } from '../presenters/answer-presenter';

@Controller('/questions/:questionId/answers')
export class FetchQuestionAnswersController {
  constructor(
    private fetchQuestionAnswers: FetchQuestionAnswersUseCase
  ){}

  @Get()
  @HttpCode(200)
  async handle(
    @Param('questionId') questionId: string,
    @Query('page') page: number
  ) {

    const result = await this.fetchQuestionAnswers.execute({ 
      questionId,
      page: page ?? 1
    });

    if (result.isLeft()) throw new BadRequestException();

    const answers = result.value.answers;

    return { answers: answers.map(AnswerPresenter.toHttp) };
  }
}