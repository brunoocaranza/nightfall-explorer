import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RateLimitException } from '../utils/exceptions';
import moment from 'moment';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../utils';

type RateLimitRecord = {
  numOfRequests: number;
  lastUpdate: string;
};

@Injectable()
export class RateLimiterGuard implements CanActivate {
  private ttl: number;
  private limit: number;
  constructor(private config: ConfigService, @Inject(REDIS_CLIENT) private readonly redisClient: Redis) {
    this.ttl = this.config.get<number>('app.throttleTtl');
    this.limit = this.config.get<number>('app.throttleLimit');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { record, ip } = await this.getRateLimitRecord(context);
    if (record) {
      if (record.numOfRequests >= this.limit) {
        throw new RateLimitException();
      }
      record.numOfRequests++;
      await this.updateRateLimitRecord(ip, record);
    } else
      await this.updateRateLimitRecord(
        ip,
        {
          numOfRequests: 1,
          lastUpdate: moment.now().toString(),
        },
        this.ttl
      );

    return true;
  }

  /**
   * Extracts rate limit record from cache if exists and ip address from request
   * @param context
   * @returns record: RateLimitRecord and ip: string
   */
  private async getRateLimitRecord(context: ExecutionContext): Promise<{ record: RateLimitRecord; ip: string }> {
    const req = context.switchToHttp().getRequest();
    const ip = req['headers']['x-forwarded-for'];
    const record = JSON.parse(await this.redisClient.get(ip));
    return { record, ip };
  }

  /**
   * Updates rate limit record in cache with all informations
   * @param ip
   */
  private async updateRateLimitRecord(ip: string, record: RateLimitRecord, ttl?: number): Promise<void> {
    if (ttl) await this.redisClient.set(ip, JSON.stringify(record), 'EX', ttl);
    else await this.redisClient.set(ip, JSON.stringify(record), 'KEEPTTL');
  }
}
