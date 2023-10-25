import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { makeAnswer } from 'test/factories/make-answer';
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository';
import { CommentOnAnswerUseCase } from './comment-on-answer';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';

let studentsRepository: InMemoryStudentsRepository;
let attachmentsRepository: InMemoryAnswerAttachmentsRepository;
let answerCommentsRepository: InMemoryAnswerCommentsRepository;
let answersRepository: InMemoryAnswersRepository;
let sut: CommentOnAnswerUseCase;

describe('Comment on answer tests', () => {
  beforeEach(() => {
    studentsRepository = new InMemoryStudentsRepository();
    attachmentsRepository = new InMemoryAnswerAttachmentsRepository();
    answerCommentsRepository = new InMemoryAnswerCommentsRepository(studentsRepository);
    answersRepository = new InMemoryAnswersRepository(attachmentsRepository);
    sut = new CommentOnAnswerUseCase(answersRepository, answerCommentsRepository);
  });

  it('should be able to comment on answer', async () => {
    const answerId = new UniqueEntityID();

    const fakeAnswer = makeAnswer({}, answerId);
    await answersRepository.create(fakeAnswer);

    await sut.execute({
      authorId: '1',
      answerId: answerId.toString(),
      content: 'Another random comment on answer'
    });

    expect(answerCommentsRepository.items).toHaveLength(1);
  });
});