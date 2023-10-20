import { BadRequestException, Body, Controller, HttpCode, Param, Patch } from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import { z } from 'zod';
import { EditQuestionUseCase } from '@forum-use-cases/edit-question';

const editQuestionSchema = z.object({
  title: z.string(),
  content: z.string(),
});
type EditQuestionSchema = z.infer<typeof editQuestionSchema>;

@Controller('/questions/:id')
export class EditQuestionController {
  constructor(
    private editQuestion: EditQuestionUseCase
  ){}

  @Patch()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') questionId: string,
    @Body(new ZodValidationPipe(editQuestionSchema)) body: EditQuestionSchema
  ) {
    const { title, content } = body;
    const userId = user.sub;

    const result = await this.editQuestion.execute({ 
      title,
      content,
      authorId: userId,
      questionId,
      attachmentsIds: [],
    });

    if (result.isLeft()) throw new BadRequestException();
  }
}