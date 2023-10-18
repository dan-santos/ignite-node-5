import { IEncrypter } from '@/domain/forum/application/cryptography/encrypter';
import { Module } from '@nestjs/common';
import { JwtEncrypter } from './jwt-encrypter';
import { IHashGenerator } from '@/domain/forum/application/cryptography/hash-generator';
import { BcryptHasher } from './bcrypt-hasher';
import { IHashComparer } from '@/domain/forum/application/cryptography/hash-comparer';

@Module({
  providers: [
    { provide: IEncrypter, useClass: JwtEncrypter },
    { provide: IHashGenerator, useClass: BcryptHasher },
    { provide: IHashComparer, useClass: BcryptHasher },
  ],
  exports: [IEncrypter, IHashComparer, IHashGenerator],
})
export class CryptographyModule {}