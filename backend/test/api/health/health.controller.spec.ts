import { HealthController } from '../../../src/api/health/health.controller';
import { Test, TestingModule } from '@nestjs/testing';

describe('Health Controller', () => {
  let healthController: HealthController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    healthController = module.get<HealthController>(HealthController);
  });

  it('should return health status OK', async () => {
    const spy = jest.spyOn(healthController, 'checkHealth');

    const res = await healthController.checkHealth();

    expect(res.status).toBe('up');
    expect(spy).toHaveBeenCalled();
  });
});
