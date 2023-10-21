import { Attachment } from '../../enterprise/entities/attachment';

export abstract class IAttachmentsRepository {
  abstract create(attachment: Attachment): Promise<void>;
}