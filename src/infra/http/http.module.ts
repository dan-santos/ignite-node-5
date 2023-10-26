import { Module } from '@nestjs/common';
import { AuthenticateController } from './controllers/authenticate.controller';
import { CreateAccountController } from './controllers/create-account.controller';
import { CreateQuestionController } from './controllers/create-question.controller';
import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions.controller';
import { DatabaseModule } from '../database/database.module';
import { CreateQuestionUseCase } from '@forum-use-cases/create-question';
import { FetchRecentQuestionsUseCase } from '@forum-use-cases/fetch-recent-questions';
import { RegisterStudentUseCase } from '@forum-use-cases/register-student';
import { AuthenticateStudentUseCase } from '@forum-use-cases/authenticate-student';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { GetQuestionBySlugController } from './controllers/get-question-by-slug.controller';
import { GetQuestionBySlugUseCase } from '@forum-use-cases/get-question-by-slug';
import { EditQuestionController } from './controllers/edit-question.controller';
import { EditQuestionUseCase } from '@forum-use-cases/edit-question';
import { DeleteQuestionController } from './controllers/delete-question.controller';
import { DeleteQuestionUseCase } from '@forum-use-cases/delete-question';
import { AnswerQuestionController } from './controllers/answer-question.controller';
import { AnswerQuestionUseCase } from '@forum-use-cases/answer-question';
import { EditAnswerController } from './controllers/edit-answer.controller';
import { EditAnswerUseCase } from '@forum-use-cases/edit-answer';
import { DeleteAnswerController } from './controllers/delete-answer.controller';
import { DeleteAnswerUseCase } from '@forum-use-cases/delete-answer';
import { FetchQuestionAnswersController } from './controllers/fetch-question-answers.controller';
import { FetchQuestionAnswersUseCase } from '@forum-use-cases/fetch-question-answers';
import { ChooseQuestionBestAnswerUseCase } from '@forum-use-cases/choose-question-best-answer';
import { ChooseQuestionBestAnswerController } from './controllers/choose-question-best-answer.controller';
import { CommentOnQuestionController } from './controllers/comment-on-question.controller';
import { CommentOnQuestionUseCase } from '@forum-use-cases/comment-on-question';
import { CommentOnAnswerController } from './controllers/comment-on-answer.controller';
import { CommentOnAnswerUseCase } from '@forum-use-cases/comment-on-answer';
import { DeleteQuestionCommentUseCase } from '@forum-use-cases/delete-question-comment';
import { DeleteQuestionCommentController } from './controllers/delete-question-comment.controller';
import { DeleteAnswerCommentController } from './controllers/delete-answer-comment.controller';
import { DeleteAnswerCommentUseCase } from '@forum-use-cases/delete-answer-comment';
import { FetchQuestionCommentsController } from './controllers/fetch-question-comments.controller';
import { FetchQuestionCommentsUseCase } from '@forum-use-cases/fetch-question-comments';
import { FetchAnswerCommentsUseCase } from '@forum-use-cases/fetch-answer-comments';
import { FetchAnswerCommentsController } from './controllers/fetch-answer-comments.controller';
import { UploadAttachmentController } from './controllers/upload-attachment.controller';
import { StorageModule } from '../storage/storage.module';
import { UploadAndCreateAttachmentUseCase } from '@forum-use-cases/upload-and-create-attachment';
import { ReadNotificationController } from './controllers/read-notification.controller';
import { ReadNotificationUseCase } from '@notification-use-cases/read-notification';

@Module({
  controllers: [
    CreateAccountController, 
    AuthenticateController, 
    CreateQuestionController,
    FetchRecentQuestionsController,
    GetQuestionBySlugController,
    EditQuestionController,
    DeleteQuestionController,
    AnswerQuestionController,
    EditAnswerController,
    DeleteAnswerController,
    FetchQuestionAnswersController,
    ChooseQuestionBestAnswerController,
    CommentOnQuestionController,
    CommentOnAnswerController,
    DeleteQuestionCommentController,
    DeleteAnswerCommentController,
    FetchQuestionCommentsController,
    FetchAnswerCommentsController,
    UploadAttachmentController,
    ReadNotificationController
  ],
  providers: [
    CreateQuestionUseCase,
    FetchRecentQuestionsUseCase,
    RegisterStudentUseCase,
    AuthenticateStudentUseCase,
    GetQuestionBySlugUseCase,
    EditQuestionUseCase,
    DeleteQuestionUseCase,
    AnswerQuestionUseCase,
    EditAnswerUseCase,
    DeleteAnswerUseCase,
    FetchQuestionAnswersUseCase,
    ChooseQuestionBestAnswerUseCase,
    CommentOnQuestionUseCase,
    CommentOnAnswerUseCase,
    DeleteQuestionCommentUseCase,
    DeleteAnswerCommentUseCase,
    FetchQuestionCommentsUseCase,
    FetchAnswerCommentsUseCase,
    UploadAndCreateAttachmentUseCase,
    ReadNotificationUseCase
  ],
  imports: [
    DatabaseModule,
    CryptographyModule,
    StorageModule
  ]
})
export class HttpModule {}