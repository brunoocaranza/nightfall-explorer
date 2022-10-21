import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { BlockCreationService } from '../../../../src/api/block-explorer/services';
import { AverageBlockCreationDTO } from '../../../../src/models';
import { NOT_APPLICABLE, TimeUnit } from '../../../../src/utils';
import { TestLogger } from '../../../mocks';

describe('Block Service', () => {
  let blockCreationService: BlockCreationService;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'explorerSyncUrl') {
        return 'https://explorer-sync.com';
      }
      return null;
    }),
  };

  const mockHttpService = {
    axiosRef: {
      get: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlockCreationService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();
    module.useLogger(new TestLogger());
    blockCreationService = module.get<BlockCreationService>(BlockCreationService);
  });

  it('should me defined', () => {
    expect(blockCreationService).toBeDefined();
  });

  it('should fetch average block time creation from explorer sync api', async () => {
    const avgCreation = new AverageBlockCreationDTO();
    avgCreation.timeUnit = TimeUnit.HOUR;
    avgCreation.value = 5;
    const httpGetSpy = jest.spyOn(mockHttpService.axiosRef, 'get').mockResolvedValue({ data: avgCreation });
    const configGetSpy = jest.spyOn(mockConfigService, 'get');

    const result = await blockCreationService.findAverageBlockCreation();

    expect(result).toMatchObject(avgCreation);
    expect(httpGetSpy).toHaveBeenCalledWith('https://explorer-sync.com/block/avg-time', { timeout: 5000 });
    expect(configGetSpy).toHaveBeenCalledWith('explorerSyncUrl');
  });

  it('should promise reject if explorer sync service is not reachable', async () => {
    jest.spyOn(mockHttpService.axiosRef, 'get').mockRejectedValue('');

    const result = await blockCreationService.findAverageBlockCreation();

    expect(result).toMatchObject({
      value: NOT_APPLICABLE,
      timeUnit: '',
    });
  });
});
