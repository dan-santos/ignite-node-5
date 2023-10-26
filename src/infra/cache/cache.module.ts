import { Module } from '@nestjs/common';
import { EnvModule } from '../env/env.module';
import { ICacheRepository } from './cache-repository';
import { RedisCacheRepository } from './redis/redis-cache-repository';
import { RedisService } from './redis/redis.service';

@Module({
  imports: [EnvModule],
  providers: [
    RedisService,
    {
      provide: ICacheRepository,
      useClass: RedisCacheRepository
    }
  ],
  exports: [ICacheRepository]
})
export class CacheModule {}