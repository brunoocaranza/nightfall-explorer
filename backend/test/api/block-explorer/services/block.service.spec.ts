import { Test, TestingModule } from '@nestjs/testing';
import { BlockService } from '../../../../src/api/block-explorer/services';
import { QueryFilter } from '../../../../src/models';
import {
  BadBlocks,
  BlockSearchFields,
  BLOCK_REPOSITORY,
  CHALLENGED_BLOCK_REPOSITORY,
  NOT_APPLICABLE,
  TransactionSearchFields,
  TRANSACTION_SERVICE,
} from '../../../../src/utils';
import {
  block,
  blockEntities,
  blockEntity,
  blockEntityPaginated,
  blockPaginated,
  challangedBlockEntity,
  challengedBlock,
  paginationParams,
  transactionEntities,
  TestLogger,
} from '../../../mocks';

describe('Block Service', () => {
  let blockService: BlockService;
  const blockNumber = block.blockNumberL2;
  const filter: QueryFilter = { [BlockSearchFields.BLOCK_NUMBER_L2]: blockNumber };
  const challengedFilter: QueryFilter = {
    [BlockSearchFields.BLOCK_NUMBER_L2]: challengedBlock.blockNumberL2,
  };

  const mockBlockRepository = {
    findOne: jest.fn().mockReturnValue(blockEntity),
    findPaginated: jest.fn().mockImplementation(() => {
      return blockEntityPaginated;
    }),
    count: jest.fn().mockReturnValue(5),
    findAll: jest.fn().mockResolvedValue(blockEntities),
  };

  const mockTransactionService = {
    queryTransactions: jest.fn().mockReturnValue(transactionEntities),
  };

  const mockChallengedBlockRepository = {
    findOne: jest.fn().mockReturnValue(challangedBlockEntity),
    findPaginated: jest.fn().mockImplementation(() => {
      return blockEntityPaginated;
    }),
    count: jest.fn(),
    findAll: jest.fn().mockReturnValue([challangedBlockEntity]),
  };

  let queryBlockSpy;
  let findPaginatedSpy;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlockService,
        {
          provide: BLOCK_REPOSITORY,
          useValue: mockBlockRepository,
        },
        {
          provide: TRANSACTION_SERVICE,
          useValue: mockTransactionService,
        },
        {
          provide: CHALLENGED_BLOCK_REPOSITORY,
          useValue: mockChallengedBlockRepository,
        },
      ],
    }).compile();
    module.useLogger(new TestLogger());
    blockService = module.get<BlockService>(BlockService);
    queryBlockSpy = jest.spyOn(blockService, 'queryBlock');
    findPaginatedSpy = jest.spyOn(mockBlockRepository, 'findPaginated');
  });

  it('should find block by block number', async () => {
    const result = await blockService.findBlockByNumber(blockNumber);
    const txFilter = { [TransactionSearchFields.TRANSACTION_HASH]: { $in: [...blockEntity.transactionHashes] } };

    expect(mockBlockRepository.findOne).toHaveBeenCalledWith(filter);
    expect(mockBlockRepository.findOne).toHaveReturnedWith(blockEntity);
    expect(mockTransactionService.queryTransactions).toHaveBeenCalledWith(txFilter);
    expect(result.transactions.length).toBe(transactionEntities.length);
    expect(result.transactions[0].transactionHash).toBe(transactionEntities[0].transactionHash);
    expect(queryBlockSpy).toHaveBeenCalledWith(filter);
  });

  it('should query block by QueryFilter', async () => {
    const result = await blockService.queryBlock(filter);
    const expected = block;
    delete expected.transactions;
    expect(mockBlockRepository.findOne).toHaveBeenCalledWith(filter);
    expect(mockBlockRepository.findOne).toHaveReturnedWith(blockEntity);
    expect(result).toMatchObject(expected);
    expect(queryBlockSpy).toHaveBeenCalledWith(filter);
  });

  it('should return blocks paginated', async () => {
    const result = await blockService.findPaginated(paginationParams);

    expect(result.docs.length).toBe(blockPaginated.docs.length);
    expect(result).toMatchObject(blockPaginated);
    expect(findPaginatedSpy).toReturnWith(blockEntityPaginated);
  });

  it('should count blocks', async () => {
    const result = await blockService.count();

    expect(mockBlockRepository.count).toHaveBeenCalledWith();
    expect(mockBlockRepository.count).toHaveReturnedWith(5);
    expect(result).toBe(5);
  });

  it('should find challanged block', async () => {
    const queryChallengedBlockSpy = jest.spyOn(blockService, 'queryChallengedBlock');
    const txFilter = { [TransactionSearchFields.TRANSACTION_HASH]: { $in: [...blockEntity.transactionHashes] } };
    const result = await blockService.findChallangedBlockByNumber(challengedBlock.blockNumberL2);

    expect(mockChallengedBlockRepository.findOne).toHaveBeenCalledWith(challengedFilter);
    expect(mockChallengedBlockRepository.findOne).toHaveReturnedWith(challangedBlockEntity);
    expect(mockTransactionService.queryTransactions).toHaveBeenCalledWith(txFilter);
    expect(result.transactions.length).toBe(challengedBlock.transactions.length);
    expect(result.transactions[0].transactionHash).toBe(challengedBlock.transactions[0].transactionHash);
    expect(queryChallengedBlockSpy).toHaveBeenCalledWith(challengedFilter);
  });

  it('should query challenged block by QueryFilter', async () => {
    const queryChallengedBlockSpy = jest.spyOn(blockService, 'queryChallengedBlock');
    const result = await blockService.queryChallengedBlock(challengedFilter);
    const expected = challengedBlock;
    delete expected.transactions;

    expect(mockChallengedBlockRepository.findOne).toHaveBeenCalledWith(challengedFilter);
    expect(mockChallengedBlockRepository.findOne).toHaveReturnedWith(challangedBlockEntity);
    expect(result.blockHash).toBe(expected.blockHash);
    expect(result.blockNumberL2).toBe(expected.blockNumberL2);
    expect(result.invalidCode).toBe(expected.invalidCode);
    expect(queryChallengedBlockSpy).toHaveBeenCalledWith(challengedFilter);
  });

  // it('should query paginated challenged blocks', async () => {
  //   const findPaginatedSpy = jest.spyOn(mockChallengedBlockRepository, 'findPaginated');

  //   const result = await blockService.findPaginated({ ...paginationParams, badBlocks: BadBlocks.SHOW_BAD });

  //   expect(result.docs.length).toBe(blockPaginated.docs.length);
  //   expect(result).toMatchObject(blockPaginated);
  //   expect(findPaginatedSpy).toHaveBeenCalledWith(paginationParams);
  // });

  describe('Challenged block stats', () => {
    it('should calculate challenged block stats', async () => {
      const challangedCount = 5;
      const blockCount = 200;
      const expected = { blockPercentage: 2.5, blocksCount: 5 };
      const challengedBlocksCountSpy = jest
        .spyOn(mockChallengedBlockRepository, 'count')
        .mockResolvedValueOnce(challangedCount);
      const blocksCountSpy = jest.spyOn(mockBlockRepository, 'count').mockReturnValueOnce(blockCount);

      const result = await blockService.getChallengedBlockStats();

      expect(result).toMatchObject(expected);
      expect(challengedBlocksCountSpy).toHaveBeenCalled();
      expect(blocksCountSpy).toHaveBeenCalled();
    });

    it('should have percentage as N/A value', async () => {
      const challangedCount = 5;
      const expected = { blockPercentage: NOT_APPLICABLE, blocksCount: 5 };
      const challengedBlocksCountSpy = jest
        .spyOn(mockChallengedBlockRepository, 'count')
        .mockReturnValueOnce(challangedCount);
      const blocksCountSpy = jest.spyOn(mockBlockRepository, 'count').mockRejectedValueOnce('Error');

      const result = await blockService.getChallengedBlockStats();

      expect(result).toMatchObject(expected);
      expect(challengedBlocksCountSpy).toHaveBeenCalled();
      expect(blocksCountSpy).toHaveBeenCalled();
    });
  });

  it('should return array of blocks', async () => {
    const findAllSpy = jest.spyOn(mockBlockRepository, 'findAll');

    const result = await blockService.queryBlockForSearch(filter);

    expect(findAllSpy).toHaveBeenCalledWith(filter);
    expect(result.length).toBe(blockEntities.length);
  });

  it('should find challenged blocks by number', async () => {
    const findAllSpy = jest.spyOn(mockChallengedBlockRepository, 'findAll');
    const result = await blockService.queryChallengedBlockForSearch(filter);

    expect(findAllSpy).toHaveBeenCalledWith(filter);
    expect(result.length).toBe(1);
  });
});
