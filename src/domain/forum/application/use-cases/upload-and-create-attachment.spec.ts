import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository';
import { UploadAndCreateAttachmentUseCase } from './upload-and-create-attachment';
import { FakeUploader } from 'test/storage/fake-uploader';
import { InvalidAttachmentTypeError } from '@/core/errors/custom-errors';

let repository: InMemoryAttachmentsRepository;
let uploader: FakeUploader;
let sut: UploadAndCreateAttachmentUseCase;

describe('Upload and create attachment tests', () => {
  beforeEach(() => {
    repository = new InMemoryAttachmentsRepository();
    uploader = new FakeUploader();
    sut = new UploadAndCreateAttachmentUseCase(repository, uploader);
  });

  it('should be able to upload a new attachment', async () => {
    const result = await sut.execute({
      fileName: 'document.png',
      fileType: 'image/png',
      body: Buffer.from('')
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      attachment: repository.items[0],
    });
    expect(uploader.uploads).toHaveLength(1);
    expect(uploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: 'document.png'
      }),
    );
  });

  it('should NOT be able to upload a new attachment with wrong mime type', async () => {
    const result = await sut.execute({
      fileName: 'document.txt',
      fileType: 'text/plain',
      body: Buffer.from('')
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidAttachmentTypeError);
    expect(uploader.uploads).toHaveLength(0);
  });
});