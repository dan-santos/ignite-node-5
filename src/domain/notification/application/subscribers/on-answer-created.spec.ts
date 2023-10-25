import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { OnAnswerCreated } from './on-answer-created';
import { makeAnswer } from 'test/factories/make-answer';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository';
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository';
import { 
  SendNotificationUseCase, 
  SendNotificationUseCaseRequest, 
  SendNotificationUseCaseResponse 
} from '../use-cases/send-notification';
import { SpyInstance, vi } from 'vitest';
import { makeQuestion } from 'test/factories/make-question';
import { waitFor } from 'test/utils/wait-for';
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';

let attachments: InMemoryAttachmentsRepository;
let studentsRepository: InMemoryStudentsRepository;
let questionsAttachments: InMemoryQuestionAttachmentsRepository;
let questionsRepository: InMemoryQuestionsRepository;
let answersRepository: InMemoryAnswersRepository;
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let notificationsRepository: InMemoryNotificationsRepository;
let sendNotificationUseCase: SendNotificationUseCase;

let sendNotificationExecuteSpy: SpyInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>;

describe('On Answer Created tests', () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
    answersRepository = new InMemoryAnswersRepository(answerAttachmentsRepository);

    attachments = new InMemoryAttachmentsRepository();
    studentsRepository = new InMemoryStudentsRepository();
    questionsAttachments = new InMemoryQuestionAttachmentsRepository();
    questionsRepository = new InMemoryQuestionsRepository(questionsAttachments, attachments, studentsRepository);

    notificationsRepository = new InMemoryNotificationsRepository();
    sendNotificationUseCase = new SendNotificationUseCase(notificationsRepository);

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute');
    new OnAnswerCreated(questionsRepository, sendNotificationUseCase);
  });

  it('should send a notification when an answer is created', async () => {
    const question = makeQuestion();
    const answer = makeAnswer({ questionId: question.id });

    await questionsRepository.create(question);
    await answersRepository.create(answer);

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });
  });
});