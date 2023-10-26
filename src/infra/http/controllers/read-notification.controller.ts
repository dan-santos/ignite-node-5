import { BadRequestException, Controller, HttpCode, Param, Patch } from '@nestjs/common';
import { ReadNotificationUseCase } from '@/domain/notification/application/use-cases/read-notification';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';

@Controller('/notifications/:id/read')
export class ReadNotificationController {
  constructor(private readNotification: ReadNotificationUseCase){}

  @Patch()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') id: string
  ) {
    const result = await this.readNotification.execute({ 
      notificationId: id,
      recipientId: user.sub,
    });

    if (result.isLeft()) throw new BadRequestException();
  }
}