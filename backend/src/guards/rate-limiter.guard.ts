import { CACHE_MANAGER, CanActivate, ExecutionContext, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { RateLimitException } from '../utils/exceptions';
import moment from 'moment';

type RateLimitRecord = {
  numOfRequests: number;
  lastUpdate: string;
};

@Injectable()
export class RateLimiterGuard implements CanActivate {
  private ttl: number;
  private limit: number;
  private logger = new Logger('RateLimiterCtx');

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache, private config: ConfigService) {
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
      await this.updateRateLimitRecord(ip, record, this.calculateTtlResetTime(record.lastUpdate));
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
    const ip = req.ips.length ? req.ips[0] : req.ip;
    const record = await this.cacheManager.get<RateLimitRecord>(ip);
    return { record, ip };
  }

  /**
   * Updates rate limit record in cache with all informations
   * @param ip
   */
  private async updateRateLimitRecord(ip: string, record: RateLimitRecord, ttl: number): Promise<void> {
    await this.cacheManager.set<RateLimitRecord>(ip, record, ttl);
  }

  /**
   * Calculates how many more seconds does client has until rate limit record is reseted from cache
   * @param lastUpdateTimestamp
   * @returns
   */
  private calculateTtlResetTime(lastUpdateTimestamp: string): number {
    const lastUpdate = moment(lastUpdateTimestamp, 'x');
    const now = moment();
    const diff = now.diff(lastUpdate, 's');
    return this.ttl - diff;
  }
}
