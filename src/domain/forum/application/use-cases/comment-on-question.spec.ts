import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { makeQuestion } from 'test/factories/make-question';
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository';
import { CommentOnQuestionUseCase } from './comment-on-question';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository';
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';

let attachments: InMemoryAttachmentsRepository;
let studentsRepository: InMemoryStudentsRepository;
let questionCommentsRepository: InMemoryQuestionCommentsRepository;
let questionAttachments: InMemoryQuestionAttachmentsRepository;
let questionsRepository: InMemoryQuestionsRepository;
let sut: CommentOnQuestionUseCase;

describe('Comment on question tests', () => {
  beforeEach(() => {
    attachments = new InMemoryAttachmentsRepository();
    studentsRepository = new InMemoryStudentsRepository();
    questionCommentsRepository = new InMemoryQuestionCommentsRepository(studentsRepository);
    questionAttachments = new InMemoryQuestionAttachmentsRepository();
    questionsRepository = new InMemoryQuestionsRepository(questionAttachments, attachments, studentsRepository);
    sut = new CommentOnQuestionUseCase(questionsRepository, questionCommentsRepository);
  });

  it('should be able to comment on question', async () => {
    const questionId = new UniqueEntityID();

    const fakeQuestion = makeQuestion({}, questionId);
    await questionsRepository.create(fakeQuestion);

    await sut.execute({
      authorId: '1',
      questionId: questionId.toString(),
      content: 'Another random comment on question'
    });

    expect(questionCommentsRepository.items).toHaveLength(1);
  });
});