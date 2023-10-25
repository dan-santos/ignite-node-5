import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { makeAnswer } from 'test/factories/make-answer';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer';
import { makeQuestion } from 'test/factories/make-question';
import { ForbiddenError } from '@/core/errors/custom-errors';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';

let attachments: InMemoryAttachmentsRepository;
let studentsRepository: InMemoryStudentsRepository;
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let answersRepository: InMemoryAnswersRepository;
let questionAttachments: InMemoryQuestionAttachmentsRepository;
let questionsRepository: InMemoryQuestionsRepository;
let sut: ChooseQuestionBestAnswerUseCase;

describe('Choose question best answer tests', () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
    answersRepository = new InMemoryAnswersRepository(answerAttachmentsRepository);
    questionAttachments = new InMemoryQuestionAttachmentsRepository();
    attachments = new InMemoryAttachmentsRepository();
    studentsRepository = new InMemoryStudentsRepository();
    questionsRepository = new InMemoryQuestionsRepository(questionAttachments, attachments, studentsRepository);
    sut = new ChooseQuestionBestAnswerUseCase(answersRepository, questionsRepository);
  });

  it('should be able to choose best answer of question', async () => {
    const questionId = new UniqueEntityID();
    const studentId = new UniqueEntityID();

    const answerId = new UniqueEntityID();
    const instructorId = new UniqueEntityID();

    const fakeQuestion = makeQuestion({ authorId: studentId }, questionId);
    await questionsRepository.create(fakeQuestion);

    const fakeAnswer = makeAnswer(
      {
        authorId: instructorId,
        questionId: fakeQuestion.id
      }, 
      answerId
    );
    await answersRepository.create(fakeAnswer);

    await sut.execute({
      answerId: answerId.toString(),
      authorId: studentId.toString()
    });

    expect(questionsRepository.items[0].bestAnswerId).toEqual(fakeAnswer.id);
  });

  it('should NOT be able to choose best answer of question of another user', async () => {
    const questionId = new UniqueEntityID();
    const studentId = new UniqueEntityID();

    const answerId = new UniqueEntityID();
    const instructorId = new UniqueEntityID();

    const fakeQuestion = makeQuestion({ authorId: studentId }, questionId);
    await questionsRepository.create(fakeQuestion);

    const fakeAnswer = makeAnswer(
      {
        authorId: instructorId,
        questionId: fakeQuestion.id
      }, 
      answerId
    );
    await answersRepository.create(fakeAnswer);

    const result = await sut.execute({
      answerId: answerId.toString(),
      authorId: 'unexistent-student-id'
    });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ForbiddenError);
  });
});