import { IAttachmentsRepository } from '@forum-repositories/attachments-repository';
import { Attachment } from '@forum-entities/attachment';
import { PrismaService } from '../prisma.service';
import { PrismaAttachmentsMapper } from '../mappers/prisma-attachments-mapper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaAttachmentsRepository implements IAttachmentsRepository {
  constructor(
    private prisma: PrismaService
  ){}

  async create(attachment: Attachment): Promise<void> {
    const data = PrismaAttachmentsMapper.toDatabase(attachment);
    
    await this.prisma.attachment.create({
      data
    });
  }
}