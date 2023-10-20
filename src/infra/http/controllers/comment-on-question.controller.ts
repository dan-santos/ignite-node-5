import { BadRequestException, Body, Controller, HttpCode, Param, Post } from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import { z } from 'zod';
import { CommentOnQuestionUseCase } from '@forum-use-cases/comment-on-question';

const commentOnQuestionSchema = z.object({
  content: z.string(),
});
type CommentOnQuestionSchema = z.infer<typeof commentOnQuestionSchema>;

@Controller('/questions/:questionId/comments')
export class CommentOnQuestionController {
  constructor(
    private commentOnQuestion: CommentOnQuestionUseCase
  ){}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('questionId') questionId: string,
    @Body(new ZodValidationPipe(commentOnQuestionSchema)) body: CommentOnQuestionSchema
  ) {
    const { content } = body;
    const userId = user.sub;

    const result = await this.commentOnQuestion.execute({ 
      authorId: userId,
      content,
      questionId
    });

    if (result.isLeft()) throw new BadRequestException();
  }
}