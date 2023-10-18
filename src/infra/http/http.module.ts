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

@Module({
  controllers: [
    CreateAccountController, 
    AuthenticateController, 
    CreateQuestionController,
    FetchRecentQuestionsController
  ],
  providers: [
    CreateQuestionUseCase,
    FetchRecentQuestionsUseCase,
    RegisterStudentUseCase,
    AuthenticateStudentUseCase
  ],
  imports: [
    DatabaseModule,
    CryptographyModule
  ]
})
export class HttpModule {}