import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { makeQuestion } from 'test/factories/make-question';
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository';
import { CommentOnQuestionUseCase } from './comment-on-question';

let questionCommentsRepository: InMemoryQuestionCommentsRepository;
let questionsRepository: InMemoryQuestionsRepository;
let sut: CommentOnQuestionUseCase;

describe('Comment on question tests', () => {
  beforeEach(() => {
    questionCommentsRepository = new InMemoryQuestionCommentsRepository();
    questionsRepository = new InMemoryQuestionsRepository();
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