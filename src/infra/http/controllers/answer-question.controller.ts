import { BadRequestException, Body, Controller, HttpCode, Param, Post } from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import { z } from 'zod';
import { AnswerQuestionUseCase } from '@forum-use-cases/answer-question';

const answerQuestionSchema = z.object({
  content: z.string(),
  attachments: z.array(z.string().uuid()).default([])
});
type AnswerQuestionSchema = z.infer<typeof answerQuestionSchema>;

@Controller('/questions/:questionId/answers')
export class AnswerQuestionController {
  constructor(
    private answerQuestion: AnswerQuestionUseCase
  ){}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('questionId') questionId: string,
    @Body(new ZodValidationPipe(answerQuestionSchema)) body: AnswerQuestionSchema
  ) {
    const { content, attachments } = body;
    const userId = user.sub;

    const result = await this.answerQuestion.execute({ 
      authorId: userId,
      questionId,
      content,
      attachmentsIds: attachments
    });

    if (result.isLeft()) throw new BadRequestException();
  }
}