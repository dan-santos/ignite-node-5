import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { makeAnswer } from 'test/factories/make-answer';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer';
import { makeQuestion } from 'test/factories/make-question';
import { ForbiddenError } from '@/core/errors/custom-errors';

let answersRepository: InMemoryAnswersRepository;
let questionsRepository: InMemoryQuestionsRepository;
let sut: ChooseQuestionBestAnswerUseCase;

describe('Choose question best answer tests', () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository();
    questionsRepository = new InMemoryQuestionsRepository();
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