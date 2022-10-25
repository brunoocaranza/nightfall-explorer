import { HttpService } from '@nestjs/axios';
import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('network')
@Controller('/health')
export class NetworkController {
  constructor(private readonly _config: ConfigService, private readonly _http: HttpService) {}

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
}
