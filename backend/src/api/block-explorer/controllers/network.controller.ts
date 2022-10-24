import { HttpService } from '@nestjs/axios';
import { Controller, Get, Inject, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../../../utils';

@ApiTags('network')
@Controller('/health')
export class NetworkController {
  constructor(
    private readonly _config: ConfigService,
    private readonly _http: HttpService,
    @Inject(REDIS_CLIENT) private readonly redisClient: Redis
  ) {}

  /**
   * Used from frontend to check if this service is up and running
   * @returns
   */
  @Get('/service')
  async serviceHealth(): Promise<any> {
    return { status: 'OK' };
  }

  /**
   * Used for health check on whole nighfall network status
   * @returns status of network. Possible values are "OK" | "KO" | "MAINTENANCE"
   */
  @Get('/network')
  async networkHealth(): Promise<any> {
    try {
      const { data } = await this._http.axiosRef.get(`${this._config.get('dashboardApiUrl')}/status`);
      return { status: data };
    } catch (error) {
      return Promise.reject(new InternalServerErrorException('Could not reach network'));
    }
  }

  /* istanbul ignore next */
  @Get('/ratelimiter/test')
  /* istanbul ignore next */
  async rateLimit(): Promise<any> {
    const result = [];
    const keys = await this.redisClient.keys('*');
    for (const key of keys) {
      const record = await this.redisClient.get(key);
      const remainingTtl = await this.redisClient.ttl(key);
      result.push({ ip: key, record: JSON.parse(record), ttlExipre: remainingTtl });
    }

    return result;
  }
}
