import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

@Controller('health')
@ApiExcludeController()
export class HealthController {
  // Used for health check on container initialization
  @Get('/')
  async checkHealth(): Promise<any> {
    return { status: 'up' };
  }
}
