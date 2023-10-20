import { BadRequestException, Body, Controller, HttpCode, Param, Post } from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import { z } from 'zod';
import { CommentOnAnswerUseCase } from '@forum-use-cases/comment-on-answer';

const commentOnAnswerSchema = z.object({
  content: z.string(),
});
type CommentOnAnswerSchema = z.infer<typeof commentOnAnswerSchema>;

@Controller('/answers/:answerId/comments')
export class CommentOnAnswerController {
  constructor(
    private commentOnAnswer: CommentOnAnswerUseCase
  ){}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('answerId') answerId: string,
    @Body(new ZodValidationPipe(commentOnAnswerSchema)) body: CommentOnAnswerSchema
  ) {
    const { content } = body;
    const userId = user.sub;

    const result = await this.commentOnAnswer.execute({ 
      authorId: userId,
      content,
      answerId
    });

    if (result.isLeft()) throw new BadRequestException();
  }
}