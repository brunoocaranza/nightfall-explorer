import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ContractController } from '../../../../src/api/block-explorer/controllers';
import { CONTRACT_CLIENT_SERVICE } from '../../../../src/utils';

describe('Contract Controller', () => {
  let contractController: ContractController;
  const mockContractClientService = {
    getContractAddress: jest.fn(),
  };
  const mockConfigService = {
    get: jest.fn().mockImplementation((key) => {
      if (key === 'contract.stateContract') {
        return 'State';
      } else if (key === 'contract.shieldContract') {
        return 'Shield';
      } else return '';
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContractController],
      providers: [
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: CONTRACT_CLIENT_SERVICE,
          useValue: mockContractClientService,
        },
      ],
    }).compile();

    contractController = module.get<ContractController>(ContractController);
  });

  afterEach(() => {
    mockContractClientService.getContractAddress.mockClear();
  });

  it('should me defined', () => {
    expect(contractController).toBeDefined();
  });

  it('should call contract client for addresses', async () => {
    // Mock
    const stateAddress = '0x1';
    const shieldAddress = '0x2';

    // Spy
    const configGetSpy = jest.spyOn(mockConfigService, 'get');
    const getContractAddressSpy = jest
      .spyOn(mockContractClientService, 'getContractAddress')
      .mockResolvedValueOnce(stateAddress)
      .mockResolvedValueOnce(shieldAddress);

    // Exe
    const result = await contractController.getContractAddresses();

    // Expect
    expect(configGetSpy).toHaveBeenCalledTimes(2);
    expect(getContractAddressSpy).toHaveBeenCalledTimes(2);
    expect(result.length).toBe(2);
  });

  it('should return only 1 address if one of 2 promises failes', async () => {
    // Mock
    const stateAddress = '0x1';

    // Spy
    jest
      .spyOn(mockContractClientService, 'getContractAddress')
      .mockResolvedValueOnce(stateAddress)
      .mockRejectedValueOnce('Error');

    // Exe
    const result = await contractController.getContractAddresses();

    // Expect
    expect(result.length).toBe(1);
  });
});
