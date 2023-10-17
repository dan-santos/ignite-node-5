import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '@/auth/current-user.decorator';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { UserPayload } from '@/auth/jwt.strategy';
import { ZodValidationPipe } from '@/pipes/zod-validation.pipe';
import { PrismaService } from '@/prisma/prisma.service';
import { z } from 'zod';

const createQuestionSchema = z.object({
  title: z.string(),
  content: z.string(),
});
type CreateQuestionSchema = z.infer<typeof createQuestionSchema>;

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(
    private prisma: PrismaService
  ){}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(new ZodValidationPipe(createQuestionSchema)) body: CreateQuestionSchema
  ) {
    const { title, content } = body;
    const userId = user.sub;

    await this.prisma.question.create({
      data: {
        title,
        content,
        slug: this.slugify(title),
        authorId: userId
      }
    });
  }

  private slugify(text: string){
    const slugText = text
      .normalize('NFKD')
      .toLocaleLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/_/g, '-')
      .replace(/--+/g, '-')
      .replace(/-$/g, '');

    return slugText;
  }
}