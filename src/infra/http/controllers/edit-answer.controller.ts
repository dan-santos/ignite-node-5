import { BadRequestException, Body, Controller, HttpCode, Param, Patch } from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import { z } from 'zod';
import { EditAnswerUseCase } from '@forum-use-cases/edit-answer';

const editAnswerSchema = z.object({
  content: z.string(),
  attachments: z.array(z.string().uuid()).default([])
});
type EditAnswerSchema = z.infer<typeof editAnswerSchema>;

@Controller('/answers/:id')
export class EditAnswerController {
  constructor(
    private editAnswer: EditAnswerUseCase
  ){}

  @Patch()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') answerId: string,
    @Body(new ZodValidationPipe(editAnswerSchema)) body: EditAnswerSchema
  ) {
    const { content, attachments } = body;
    const userId = user.sub;

    const result = await this.editAnswer.execute({ 
      content,
      authorId: userId,
      answerId,
      attachmentsIds: attachments,
    });

    if (result.isLeft()) throw new BadRequestException();
  }
}