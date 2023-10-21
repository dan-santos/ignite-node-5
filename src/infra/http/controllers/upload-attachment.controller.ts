import { InvalidAttachmentTypeError } from '@/core/errors/custom-errors';
import { UploadAndCreateAttachmentUseCase } from '@forum-use-cases/upload-and-create-attachment';
import { 
  BadRequestException,
  Controller, 
  FileTypeValidator, 
  HttpCode, 
  MaxFileSizeValidator, 
  ParseFilePipe, 
  Post, 
  UnsupportedMediaTypeException, 
  UploadedFile, 
  UseInterceptors 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/attachments')
export class UploadAttachmentController {

  constructor(
    private uploadAndCreateAttachment: UploadAndCreateAttachmentUseCase
  ){}
  
  @Post()
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('file'))
  async handle (
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ 
            maxSize: 1024 * 1024 * 2 //2mb
          }),
          new FileTypeValidator({ fileType: '.(png|jpg|jpeg|pdf)' }),
        ],
      }),
    )
      file: Express.Multer.File
  ){
    const result = await this.uploadAndCreateAttachment.execute({
      fileName: file.originalname,
      fileType: file.mimetype,
      body: file.buffer
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
      case InvalidAttachmentTypeError:
        throw new UnsupportedMediaTypeException(error.message);
      default:
        throw new BadRequestException(error.message);
      }
    }

    const { attachment } = result.value;

    return {
      attachmentId: attachment.id.toString()
    };
  }
}