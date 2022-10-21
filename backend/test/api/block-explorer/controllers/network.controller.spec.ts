import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { NetworkController } from '../../../../src/api/block-explorer/controllers';

describe('Network Controller', () => {
  let networkController: NetworkController;
  const expectedResult = { status: 'OK' };

  const mockConfigService = {
    get: jest.fn().mockImplementation((key) => {
      if (key === 'dashboardApiUrl') {
        return 'https://somedomain.com';
      }
      return '';
    }),
  };
  const mockHttpService = {
    axiosRef: {
      get: jest.fn(),
    },
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NetworkController],
      providers: [
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
        {
          provide: CACHE_MANAGER,
          useValue: {},
        },
      ],
    }).compile();

    networkController = module.get<NetworkController>(NetworkController);
  });

  it('should me defined', () => {
    expect(networkController).toBeDefined();
  });

  it('should return status up for service health check', async () => {
    jest.spyOn(mockHttpService.axiosRef, 'get');
    const result = await networkController.serviceHealth();
    expect(result).toMatchObject(expectedResult);
  });

  it('should return status up for network health check', async () => {
    const configSpy = jest.spyOn(mockConfigService, 'get');
    const httpSpy = jest.spyOn(mockHttpService.axiosRef, 'get').mockResolvedValue({ data: 'OK' });

    const result = await networkController.networkHealth();
    expect(result).toMatchObject(expectedResult);

    expect(configSpy).toHaveBeenCalledWith('dashboardApiUrl');
    expect(httpSpy).toHaveBeenCalledWith('https://somedomain.com/status');
  });

  it('should throw internal error if network is not reachable', async () => {
    jest.spyOn(mockConfigService, 'get');
    jest.spyOn(mockHttpService.axiosRef, 'get').mockRejectedValue('Could not reach network');

    await expect(networkController.networkHealth()).rejects.toThrowError('Could not reach network');
  });
});
