import { 
  BadRequestException, 
  Body, 
  ConflictException, 
  Controller, 
  HttpCode, 
  Post, 
  UnauthorizedException, 
  UsePipes 
} from '@nestjs/common';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import { z } from 'zod';
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student';
import { ConflictError, WrongCredentialsError } from '@/core/errors/custom-errors';
import { Public } from '@/infra/auth/public';

const authBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
type AuthBodySchema = z.infer<typeof authBodySchema>;

@Controller('/sessions')
@Public()
export class AuthenticateController {
  
  constructor(private auth: AuthenticateStudentUseCase){}

  @Post()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(authBodySchema))
  async handle(@Body() body: AuthBodySchema) {
    const { email, password } = body;

    const result = await this.auth.execute({ email, password });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
      case WrongCredentialsError:
        throw new UnauthorizedException(error.message);
      case ConflictError:
        throw new ConflictException(error.message);
      default:
        throw new BadRequestException(error.message);
      }
    }

    const { accessToken } = result.value;
    return {
      access_token: accessToken,
    };
  }
}