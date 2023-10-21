import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { InvalidAttachmentTypeError } from '@/core/errors/custom-errors';
import { Attachment } from '../../enterprise/entities/attachment';
import { IAttachmentsRepository } from '../repositories/attachments-repository';
import { Uploader } from '../storage/uploader';

interface UploadAndCreateAttachmentUseCaseRequest {
  fileName: string;
  fileType: string;
  body: Buffer;
}

type UploadAndCreateAttachmentUseCaseResponse = Either<
  InvalidAttachmentTypeError,
  {
    attachment: Attachment
  }
>;

@Injectable()
export class UploadAndCreateAttachmentUseCase {
  constructor(
    private attachmentsRepository: IAttachmentsRepository,
    private uploader: Uploader
  ){}

  async execute({
    fileName,
    fileType,
    body
  }: UploadAndCreateAttachmentUseCaseRequest): Promise<UploadAndCreateAttachmentUseCaseResponse> {
    if (!/^(image\/(jpeg|png))$|^application\/pdf$/.test(fileType)) {
      return left(new InvalidAttachmentTypeError());
    }

    const { url } = await this.uploader.upload({
      fileName,
      fileType,
      body
    });

    const attachment = Attachment.create({
      title: fileName,
      url,
    });

    await this.attachmentsRepository.create(attachment);
    
    return right({ attachment });
  }
}