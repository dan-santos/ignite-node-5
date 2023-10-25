import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Attachment, AttachmentProps } from '@forum-entities/attachment';

import { fakerPT_BR as faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaAttachmentsMapper } from '@/infra/database/prisma/mappers/prisma-attachments-mapper';

export function makeAttachment(
  override: Partial<AttachmentProps> = {},
  id?: UniqueEntityID,
) {
  const fakeAttachment = Attachment.create({
    title: faker.lorem.slug(),
    url: faker.lorem.slug(),
    ...override,
  },
  id,
  );

  return fakeAttachment;
}

@Injectable()
export class AttachmentFactory {
  constructor(private prisma: PrismaService) {}

  async makeDatabaseAttachment(data: Partial<AttachmentProps> = {}): Promise<Attachment> {
    const attachment = makeAttachment(data);

    await this.prisma.attachment.create({
      data: PrismaAttachmentsMapper.toDatabase(attachment),
    });

    return attachment;
  }
}