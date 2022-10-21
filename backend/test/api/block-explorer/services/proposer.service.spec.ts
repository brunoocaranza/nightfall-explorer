import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { ProposerService } from '../../../../src/api/block-explorer/services';
import {
  BlockSearchFields,
  CHALLENGED_BLOCK_REPOSITORY,
  CONTRACT_CLIENT_SERVICE,
  NOT_APPLICABLE,
  PROPOSER_REPOSITORY,
  Resources,
} from '../../../../src/utils';
import { proposer, proposerEntity, proposerEntityPaginated, TestLogger } from '../../../mocks';
import { ProposerDTO, ProposerPaginationParams } from '../../../../src/models';
import {
  PROPOSER_FEES_ERROR,
  PROPOSER_MEMPOOL_ERROR,
  ResourceNotFoundException,
} from '../../../../src/utils/exceptions';

describe('Proposer Service', () => {
  let proposerService: ProposerService;

  const mockContractClientService = {
    getCurrentProposer: jest.fn().mockReturnValue({ address: proposer.address, url: proposer.url }),
  };

  const mockHttpService = {
    axiosRef: { get: jest.fn() },
  };

  const mockChallengedBlockRepository = {
    count: jest.fn(),
    countChallengedBlocks: jest.fn(),
  };

  const mockProposerRepository = {
    findOne: jest.fn().mockResolvedValue(proposerEntity),
    findAll: jest.fn().mockResolvedValue([proposerEntity]),
    findPaginated: jest.fn().mockResolvedValue(proposerEntityPaginated),
  };

  const proposerUrl = 'https://proposer.com';
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProposerService,
        {
          provide: CONTRACT_CLIENT_SERVICE,
          useValue: mockContractClientService,
        },
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
        {
          provide: CHALLENGED_BLOCK_REPOSITORY,
          useValue: mockChallengedBlockRepository,
        },
        {
          provide: PROPOSER_REPOSITORY,
          useValue: mockProposerRepository,
        },
      ],
    }).compile();
    module.useLogger(new TestLogger());
    proposerService = module.get<ProposerService>(ProposerService);
  });

  it('should be defined', () => {
    expect(proposerService).toBeDefined();
  });

  describe('Proposer mempool', () => {
    it('should return pending transactions', async () => {
      // Mock
      const httpResponseMock = {
        mempoolTransactions: [{}, {}],
      };

      // Spy
      const httpSpy = jest.spyOn(mockHttpService.axiosRef, 'get').mockResolvedValueOnce({ data: httpResponseMock });

      // Exe
      const result = await proposerService.getProposerMempool(proposerUrl);

      // Expect
      expect(httpSpy).toHaveBeenCalledWith(`${proposerUrl}/proposer/mempool`);
      expect(result.length).toBe(httpResponseMock.mempoolTransactions.length);
    });

    it('should reject promise if proposer is not reachable', async () => {
      // Spy
      jest.spyOn(mockHttpService.axiosRef, 'get').mockRejectedValueOnce('Error');

      // Expect
      await expect(proposerService.getProposerMempool(proposerUrl)).rejects.toEqual(
        `${PROPOSER_MEMPOOL_ERROR} - ${proposerUrl}/proposer/mempool`
      );
    });
  });

  describe('Pending transactions', () => {
    it('should return count of pending transactions', async () => {
      const mempoolResponse = [{}, {}];
      const currentProposerSpy = jest
        .spyOn(mockContractClientService, 'getCurrentProposer')
        .mockResolvedValueOnce({ url: proposerUrl });
      const getProposerMempoolSpy = jest
        .spyOn(proposerService, 'getProposerMempool')
        .mockResolvedValueOnce(mempoolResponse);

      const result = await proposerService.countPendingTransactions();

      expect(result).toBe(mempoolResponse.length);
      expect(currentProposerSpy).toHaveBeenCalled();
      expect(getProposerMempoolSpy).toHaveBeenCalledWith(proposerUrl);
    });

    it('should return N/A value if any of promises failes', async () => {
      const currentProposerSpy = jest
        .spyOn(mockContractClientService, 'getCurrentProposer')
        .mockResolvedValueOnce({ url: proposerUrl });
      jest.spyOn(proposerService, 'getProposerMempool').mockRejectedValueOnce('');

      const result = await proposerService.countPendingTransactions();

      expect(result).toBe(NOT_APPLICABLE);
      expect(currentProposerSpy).toHaveBeenCalled();
    });
  });

  describe("Proposer's fee", () => {
    it('should return proposers fee', async () => {
      // Mock
      const fee = 0.3;

      // Spy
      const httpSpy = jest.spyOn(mockHttpService.axiosRef, 'get').mockResolvedValueOnce({ data: { fee } });

      // Exe
      const result = await proposerService.getProposerFee(proposerUrl);

      // Expect
      expect(httpSpy).toHaveBeenCalledWith(`${proposerUrl}/proposer/fee`);
      expect(result).toBe(fee);
    });

    it('should reject promise if proposer is not reachable', async () => {
      // Spy
      jest.spyOn(mockHttpService.axiosRef, 'get').mockRejectedValueOnce('Error');

      // Expect
      await expect(proposerService.getProposerFee(proposerUrl)).rejects.toEqual(
        `${PROPOSER_FEES_ERROR} - ${proposerUrl}/proposer/fee`
      );
    });
  });

  describe('Query proposer', () => {
    const proposer = {
      address: '0xCaE0ed659d7821b59bBFd1b6B79260051e5E9111',
      url: 'https://proposer.testnet.polygon-nightfall.technology',
      fee: NOT_APPLICABLE,
      isActive: true,
      stats: {
        goodBlocks: 0,
        badBlocks: 0,
        blocks: 0,
        challengedBlocks: NOT_APPLICABLE,
      },
    };

    it('should query proposer', async () => {
      const findOneSpy = jest.spyOn(mockProposerRepository, 'findOne');

      const result = await proposerService.queryProposer(proposer.address);
      expect(findOneSpy).toHaveBeenCalledWith({ address: proposer.address });
      expect(result).toMatchObject(proposer);
    });

    it("should throw ResourceNotFoundException if proposer doesn't exist", async () => {
      jest
        .spyOn(mockProposerRepository, 'findOne')
        .mockRejectedValue(new ResourceNotFoundException(Resources.PROPOSER));

      try {
        await proposerService.queryProposer(proposer.address);
      } catch (error) {
        expect(error).toBeInstanceOf(ResourceNotFoundException);
      }
    });
  });

  it('should count proposers challenged blocks', async () => {
    const blocksCount = 5;
    const address = '0x123125412513';
    const countProposersBlocksSpy = jest
      .spyOn(mockChallengedBlockRepository, 'countChallengedBlocks')
      .mockResolvedValueOnce(blocksCount);

    const result = await proposerService.countChallengedBlocks(address);

    expect(result).toBe(blocksCount);
    expect(countProposersBlocksSpy).toHaveBeenCalledWith({ [BlockSearchFields.PROPOSER]: address });
  });

  it('should get proposer info', async () => {
    // Mocks
    const challengedBlocksCount = 5;
    const fee = 0.3;

    // Spy
    const getProposerFeeSpy = jest.spyOn(proposerService, 'getProposerFee').mockResolvedValueOnce(fee);
    const queryProposerSpy = jest.spyOn(proposerService, 'queryProposer').mockResolvedValueOnce(proposer);
    const countChallengedBlocksSpy = jest
      .spyOn(proposerService, 'countChallengedBlocks')
      .mockResolvedValueOnce(challengedBlocksCount);

    // Exe
    const result = await proposerService.getProposerInfo(proposer.address);

    // Expect
    expect(result).toMatchObject(proposer);
    expect(queryProposerSpy).toHaveBeenCalledWith(proposer.address);
    expect(getProposerFeeSpy).toHaveBeenCalledWith(proposer.url);
    expect(countChallengedBlocksSpy).toHaveBeenCalledWith(proposer.address);
  });

  it('should have fee as N/A', async () => {
    // Spy
    jest.spyOn(proposerService, 'queryProposer').mockResolvedValueOnce(proposer);
    jest.spyOn(proposerService, 'getProposerFee').mockRejectedValueOnce('fail');

    // Exe
    const result: ProposerDTO = await proposerService.getProposerInfo(proposer.address);

    // Expect
    expect(result.fee).toBe(NOT_APPLICABLE);
  });

  it('should find proposers paginated', async () => {
    const params = new ProposerPaginationParams();
    params.sortDirection = 'asc';
    params.limit = 2;
    params.page = 1;
    params.sortColumn = 'goodBlocks';
    params.address = '0x1231231232';
    const findPaginatedSpy = jest.spyOn(mockProposerRepository, 'findPaginated');

    const result = await proposerService.findPaginated(params);
    expect(findPaginatedSpy).toHaveBeenCalledWith(params);
    expect(result.docs.length).toBe(proposerEntityPaginated.docs.length);
  });

  it('should return array of proposer addresses', async () => {
    const findAllSpy = jest.spyOn(mockProposerRepository, 'findAll');
    const result = await proposerService.getProposerAddresses();
    expect(result).toMatchObject([proposerEntity].map((item) => item.address));
    expect(findAllSpy).toHaveBeenCalled();
  });
});
