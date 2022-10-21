import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ContractClientService } from '../../../../src/api/block-explorer/services';
import Web3 from 'web3';
import { STATE_CONTRACT_CURRENT_PROPOSER_ERROR } from '../../../../src/utils/exceptions';
import { HttpService } from '@nestjs/axios';
import { proposer, TestLogger } from '../../../mocks';

const mockProposer = {
  '0': '0xCaE0ed659d7821b59bBFd1b6B79260051e5E9111',
  '1': '0xCaE0ed659d7821b59bBFd1b6B79260051e5E9111',
  '2': '0xCaE0ed659d7821b59bBFd1b6B79260051e5E9111',
  '3': 'https://proposer.testnet.polygon-nightfall.technology',
  thisAddress: '0xCaE0ed659d7821b59bBFd1b6B79260051e5E9111',
  previousAddress: '0xCaE0ed659d7821b59bBFd1b6B79260051e5E9111',
  nextAddress: '0xCaE0ed659d7821b59bBFd1b6B79260051e5E9111',
  url: 'https://proposer.testnet.polygon-nightfall.technology',
};

jest.mock('web3', () => {
  return class Web3 {
    private readonly provider: any;
    constructor(provider: any) {
      this.provider = provider;
    }

    static readonly providers = {
      WebsocketProvider: jest.fn().mockReturnValue({ on: jest.fn() }),
    };

    eth = {
      Contract: jest.fn().mockReturnValue({
        methods: {
          currentProposer: jest.fn().mockReturnValue({ call: jest.fn().mockReturnValue(mockProposer) }),
        },
      }),
    };
  };
});

describe('Contract Client service', () => {
  let contractClientService: ContractClientService;
  const optimistUrl = 'https://optimist.com';
  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'contract.blockchainUrl') {
        return 'wss://url.com';
      } else if (key === 'web3ProviderOptions') {
        return {
          clientConfig: {
            keepalive: true,
            keepaliveInterval: 1500,
          },
          timeout: 0,
          reconnect: {
            auto: true,
            delay: 5000, // ms
            maxAttempts: 120,
            onTimeout: false,
          },
        };
      } else if (key === 'contract.stateContract') {
        return 'State';
      } else if (key === 'contract.optimistApiUrl') return optimistUrl;
      return null;
    }),
  };
  const mockHttpService = {
    axiosRef: {
      get: jest.fn(),
    },
  };
  const getContractInstance = () => {
    const wsProvider = new Web3.providers.WebsocketProvider('', {});
    const client = new Web3(wsProvider);
    const stateContract = new client.eth.Contract({} as any, '');

    return stateContract;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContractClientService,
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
    contractClientService = module.get<ContractClientService>(ContractClientService);
  });

  afterEach(() => {
    mockHttpService.axiosRef.get.mockClear();
  });

  it('should be defined', () => {
    expect(contractClientService).toBeDefined();
  });

  it('should call initializeContract in init', async () => {
    // Mock
    const contractName = 'State';

    // Spy
    const getContractAddressSpy = jest
      .spyOn(contractClientService, 'getContractAddress')
      .mockResolvedValue(proposer.address);
    const getContractAbiSpy = jest.spyOn(contractClientService, 'getContractAbi').mockResolvedValue({});
    const initializeContractSpy = jest.spyOn(contractClientService, 'initializeContract');
    const configGetSpy = jest.spyOn(mockConfigService, 'get');
    getContractInstance();

    // Execute
    await contractClientService.init();

    // Expect
    expect(getContractAddressSpy).toHaveBeenCalledWith(contractName);
    expect(getContractAbiSpy).toHaveBeenCalledWith(contractName);
    expect(initializeContractSpy).toHaveBeenCalledWith({}, proposer.address);
    expect(configGetSpy).toHaveBeenCalledWith('contract.stateContract');
  });

  describe('Contract address fetch', () => {
    it('should request contract address from optimist', async () => {
      const contractAddress = '0xB93k2d293D1cA7A199DB4468CD5882f06e959C91';
      const contractName = 'State';
      const httpGetSpy = jest
        .spyOn(mockHttpService.axiosRef, 'get')
        .mockResolvedValue({ data: { address: contractAddress } });
      const configGetSpy = jest.spyOn(mockConfigService, 'get');

      const result = await contractClientService.getContractAddress(contractName);

      expect(httpGetSpy).toHaveBeenCalledWith(`${optimistUrl}/contract-address/${contractName}`);
      expect(result).toBe(contractAddress);
      expect(configGetSpy).toHaveBeenCalledWith('contract.optimistApiUrl');
    });

    it("should exit application when optimist isn't reachable", async () => {
      const processExitSpy = jest.spyOn(process, 'exit').mockReturnValue('' as never);
      jest.spyOn(mockHttpService.axiosRef, 'get').mockRejectedValue('');

      await contractClientService.getContractAddress('');
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });
  });

  describe('Contract abi fetch', () => {
    it('should request contract abi from optimist', async () => {
      const contractAbi = {};
      const contractName = 'State';
      const httpGetSpy = jest.spyOn(mockHttpService.axiosRef, 'get').mockResolvedValue({ data: { abi: contractAbi } });

      const result = await contractClientService.getContractAbi(contractName);

      expect(httpGetSpy).toHaveBeenCalledWith(`${optimistUrl}/contract-abi/${contractName}`);
      expect(result).toMatchObject(contractAbi);
    });

    it("should exit application when optimist isn't reachable", async () => {
      const processExitSpy = jest.spyOn(process, 'exit').mockReturnValue('' as never);
      jest.spyOn(mockHttpService.axiosRef, 'get').mockRejectedValueOnce('');

      await contractClientService.getContractAbi('');
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });
  });

  describe('Get current proposer', () => {
    it('should return current proposer', async () => {
      await contractClientService.init();
      const result = await contractClientService.getCurrentProposer();

      expect(result.address).toBe(mockProposer.thisAddress);
    });

    it('should return promise reject if currentProposer method is not reachable', async () => {
      const stateContract = getContractInstance();
      jest.spyOn(stateContract.methods, 'currentProposer').mockRejectedValue('');

      await expect(contractClientService.getCurrentProposer()).rejects.toEqual(STATE_CONTRACT_CURRENT_PROPOSER_ERROR);
    });
  });
});
