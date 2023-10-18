import { Question } from '@forum-entities/question';
import { IQuestionsRepository } from '@forum-repositories/questions-repository';
import { Either, left, right } from '@/core/either';
import { ForbiddenError, ResourceNotFoundError } from '@/core/errors/custom-errors';
import { IQuestionAttachmentsRepository } from '@forum-repositories/question-attachments-repository';
import { QuestionAttachmentList } from '@forum-entities/question-attachment-list';
import { QuestionAttachment } from '@forum-entities/question-attachment';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

interface EditQuestionUseCaseRequest {
  questionId: string;
  authorId: string;
  title: string;
  content: string;
  attachmentsIds: string[];
}

type EditQuestionUseCaseResponse = Either<ResourceNotFoundError | ForbiddenError, {
  question: Question;
}>

export class EditQuestionUseCase {
  constructor(
    private questionsRepository: IQuestionsRepository,
    private questionAttachmentsRepository: IQuestionAttachmentsRepository,
  ){}

  async execute({
    questionId,
    authorId,
    title,
    content,
    attachmentsIds,
  }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId);

    if (!question) return left(new ResourceNotFoundError());
    if (authorId !== question.authorId.toString()) {
      return left(new ForbiddenError());
    }

    // create attachment list to be updated
    const currentQuestionAttachments = await this.questionAttachmentsRepository
      .findManyByQuestionId(questionId);
    const questionAttachmentList = new QuestionAttachmentList(currentQuestionAttachments);

    // create current question attachments
    const questionAttachments = attachmentsIds.map(attachmentId => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        questionId: question.id,
      });
    });

    // updates the attachment list merging changes between old and new attachment lists
    questionAttachmentList.update(questionAttachments);

    question.title = title;
    question.content = content;
    question.attachments = questionAttachmentList;

    await this.questionsRepository.save(question);
    
    return right({ question });
  }
}