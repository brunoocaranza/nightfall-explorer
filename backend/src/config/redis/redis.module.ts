import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../../utils';

type RedisOptions = {
  host: string;
  port: number;
};

const createClient = async (options: RedisOptions): Promise<Redis> => {
  const logger = new Logger('RedisModule');
  const client = new Redis({ ...options });
  client.on('error', (error) => {
    logger.error(error);
    process.exit(1);
  });

  client.on('connect', () => {
    logger.log('Successfully connected to redis.');
  });

  return client;
};

@Module({
  imports: [ConfigModule],
  providers: [
    {
      inject: [ConfigService],
      provide: REDIS_CLIENT,
      useFactory: async (config: ConfigService): Promise<Redis> => {
        return createClient({ host: config.get('redis.host'), port: config.get<number>('redis.port') });
      },
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}
