import { IHashComparer } from '@/domain/forum/application/cryptography/hash-comparer';
import { IHashGenerator } from '@/domain/forum/application/cryptography/hash-generator';
import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';

@Injectable()
export class BcryptHasher implements IHashComparer, IHashGenerator {
  private SALT_LENGTH = 8;
  compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash);
  }
  hash(plain: string): Promise<string> {
    return hash(plain, this.SALT_LENGTH);
  }
}