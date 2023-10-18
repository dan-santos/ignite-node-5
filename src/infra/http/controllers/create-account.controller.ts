import { BadRequestException, Body, ConflictException, Controller, HttpCode, Post, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import { z } from 'zod';
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student';
import { ConflictError } from '@/core/errors/custom-errors';
import { Public } from '@/infra/auth/public';

const createBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string()
});
type CreateBodySchema = z.infer<typeof createBodySchema>;

@Controller('/accounts')
@Public()
export class CreateAccountController {
  
  constructor(private registerStudent: RegisterStudentUseCase){}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createBodySchema))
  async handle(@Body() body: CreateBodySchema) {
    const { name, email, password } = body;

    const result = await this.registerStudent.execute({ name, email, password });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
      case ConflictError:
        throw new ConflictException(error.message);
      default:
        throw new BadRequestException(error.message);
      }
    }

    if (result.isLeft()) throw new Error();
  }
}