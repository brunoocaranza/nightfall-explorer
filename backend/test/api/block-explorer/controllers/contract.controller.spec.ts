import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ContractController } from '../../../../src/api/block-explorer/controllers';
import { CONTRACT_CLIENT_SERVICE } from '../../../../src/utils';

describe('Contract Controller', () => {
  let contractController: ContractController;
  const mockContractClientService = {
    getContractAddresses: jest.fn(),
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
    mockContractClientService.getContractAddresses.mockClear();
  });

  it('should me defined', () => {
    expect(contractController).toBeDefined();
  });

  it('should call contract client for addresses', async () => {
    // Mock
    const stateAddress = '0x1';
    const shieldAddress = '0x2';

    // Spy
    const getContractAddressSpy = jest
      .spyOn(mockContractClientService, 'getContractAddresses')
      .mockReturnValueOnce([{ state: stateAddress }, { shield: shieldAddress }]);

    // Exe
    const result = contractController.getContractAddresses();

    // Expect
    expect(getContractAddressSpy).toHaveBeenCalledTimes(1);
    expect(result.length).toBe(2);
    expect(result[0]['state']).toBe(stateAddress);
    expect(result[1]['shield']).toBe(shieldAddress);
  });
});
