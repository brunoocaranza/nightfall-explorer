import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER, Controller, Get, Inject, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { Cache } from 'cache-manager';
@ApiTags('network')
@Controller('/health')
export class NetworkController {
  constructor(
    private readonly _config: ConfigService,
    private readonly _http: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
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
    const keys = await this.cacheManager.store.keys();
    //Loop through keys and get data
    const allData: { [key: string]: any } = {};
    for (const key of keys) {
      allData[`${key}`] = await this.cacheManager.get(key);
    }
    return allData;
  }
}
