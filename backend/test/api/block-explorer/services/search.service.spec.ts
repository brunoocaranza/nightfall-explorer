import { Test, TestingModule } from '@nestjs/testing';
import { SearchService } from '../../../../src/api/block-explorer/services';
import { BlockDTO, ChallengedBlockDTO, ProposerDTO, SearchResultDTO } from '../../../../src/models';
import {
  BLOCK_SERVICE,
  HelperService,
  PROPOSER_SERVICE,
  Resources,
  SearchTerms,
  TRANSACTION_SERVICE,
} from '../../../../src/utils';
import { ResourceNotFoundException } from '../../../../src/utils/exceptions';
import {
  block,
  transaction,
  proposer,
  sameL2L1BlockNumbers,
  challengedBlock,
  sameL2L1ChallangedBlocks,
} from '../../../mocks';

describe('Search Service', () => {
  let searchService: SearchService;

  const notFoundBlockNumber = '99999999';
  const notFoundHash = '0x123213123';
  const mockBlockService = {
    queryBlock: jest.fn(),
    queryBlockForSearch: jest.fn(),
    queryChallengedBlock: jest.fn(),
    queryChallengedBlockForSearch: jest.fn(),
  };

  const mockTransactionService = {
    queryTransaction: jest.fn(),
  };

  const mockProposerService = {
    queryProposer: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchService,
        {
          provide: BLOCK_SERVICE,
          useValue: mockBlockService,
        },
        {
          provide: TRANSACTION_SERVICE,
          useValue: mockTransactionService,
        },
        {
          provide: PROPOSER_SERVICE,
          useValue: mockProposerService,
        },
      ],
    }).compile();

    searchService = module.get<SearchService>(SearchService);
  });

  it('should throw ResourceNotFoundException with invalid search parameter on search by block number', async () => {
    const searchByBlockNumberFactorySpy = jest
      .spyOn(searchService, 'searchByBlockNumberFactory')
      .mockRejectedValueOnce('');
    await expect(searchService.search(notFoundBlockNumber, SearchTerms.BY_BLOCK_NUMBER)).rejects.toThrowError(
      ResourceNotFoundException
    );

    expect(searchByBlockNumberFactorySpy).toHaveBeenCalledWith(notFoundBlockNumber);
  });

  it('should throw ResourceNotFoundException with invalid search parameter on search resource factory', async () => {
    const seachResourceFactorySpy = jest.spyOn(searchService, 'seachResourceFactory').mockRejectedValueOnce('');
    await expect(searchService.search(notFoundHash, SearchTerms.BY_HASH)).rejects.toThrowError(
      ResourceNotFoundException
    );

    expect(seachResourceFactorySpy).toHaveBeenCalledWith(notFoundHash, SearchTerms.BY_HASH);
  });

  describe('Search by hash or proposer address', () => {
    it('should search tranasction and return search result object', async () => {
      const seachResourceFactorySpy = jest
        .spyOn(searchService, 'seachResourceFactory')
        .mockResolvedValueOnce(transaction);

      const result = (await searchService.search(transaction.transactionHash, SearchTerms.BY_HASH)) as SearchResultDTO;
      expect(seachResourceFactorySpy).toHaveBeenCalledWith(transaction.transactionHash, SearchTerms.BY_HASH);
      expect(result.type).toBe(Resources.TRANSACTION);
      expect(result.value).toBe(transaction.transactionHash);
    });

    it('should search proposer and return search result object', async () => {
      Object.setPrototypeOf(proposer, new ProposerDTO());
      const seachResourceFactorySpy = jest.spyOn(searchService, 'seachResourceFactory').mockResolvedValueOnce(proposer);

      const result = (await searchService.search(proposer.address, SearchTerms.BY_PROPOSER_ADDRESS)) as SearchResultDTO;
      expect(seachResourceFactorySpy).toHaveBeenCalledWith(proposer.address, SearchTerms.BY_PROPOSER_ADDRESS);
      expect(result.type).toBe(Resources.PROPOSER);
      expect(result.value).toBe(proposer.address);
    });

    it('should search block and return search result object', async () => {
      Object.setPrototypeOf(block, new BlockDTO());
      const seachResourceFactorySpy = jest.spyOn(searchService, 'seachResourceFactory').mockResolvedValueOnce(block);

      const result = (await searchService.search(block.blockHash, SearchTerms.BY_HASH)) as SearchResultDTO;
      expect(seachResourceFactorySpy).toHaveBeenCalledWith(block.blockHash, SearchTerms.BY_HASH);
      expect(result.type).toBe(Resources.BLOCK);
      expect(result.value).toBe(block.blockNumberL2.toString());
    });
  });

  describe('Search by block number', () => {
    it('should find block ', async () => {
      const searchByBlockNumberFactorySpy = jest
        .spyOn(searchService, 'searchByBlockNumberFactory')
        .mockResolvedValueOnce([block]);
      const result = (await searchService.search(
        block.blockNumberL2.toString(),
        SearchTerms.BY_BLOCK_NUMBER
      )) as SearchResultDTO[];

      expect(searchByBlockNumberFactorySpy).toHaveBeenCalledWith(block.blockNumberL2.toString());
      expect(result.length).toBe(1);
      expect(result[0].type).toBe(Resources.BLOCK);
      expect(result[0].value).toBe(block.blockNumberL2.toString());
    });

    it('should find blocks with overlapping block numbers ', async () => {
      sameL2L1BlockNumbers.forEach((block) => Object.setPrototypeOf(block, new BlockDTO()));
      const searchValue = sameL2L1BlockNumbers[0].blockNumberL2.toString();

      const searchByBlockNumberFactorySpy = jest
        .spyOn(searchService, 'searchByBlockNumberFactory')
        .mockResolvedValueOnce(sameL2L1BlockNumbers);
      const result = (await searchService.search(searchValue, SearchTerms.BY_BLOCK_NUMBER)) as SearchResultDTO[];

      expect(searchByBlockNumberFactorySpy).toHaveBeenCalledWith(searchValue);
      expect(result.length).toBe(2);
      expect(result[0].type).toBe(Resources.BLOCK);
      expect(result[1].type).toBe(Resources.BLOCK_L1);
    });

    it('should find challenged block', async () => {
      sameL2L1ChallangedBlocks.forEach((block) => Object.setPrototypeOf(block, new ChallengedBlockDTO()));
      const searchValue = sameL2L1ChallangedBlocks[0].blockNumber.toString();

      const searchByBlockNumberFactorySpy = jest
        .spyOn(searchService, 'searchByBlockNumberFactory')
        .mockResolvedValueOnce([sameL2L1ChallangedBlocks[0]]);
      const result = (await searchService.search(searchValue, SearchTerms.BY_BLOCK_NUMBER)) as SearchResultDTO[];

      expect(searchByBlockNumberFactorySpy).toHaveBeenCalledWith(searchValue);
      expect(result.length).toBe(1);
      expect(result[0].type).toBe(Resources.CHALLENGED_BLOCK_L1);
    });

    it('should find challenged blocks with overlapping block numbers ', async () => {
      sameL2L1ChallangedBlocks.forEach((block) => Object.setPrototypeOf(block, new ChallengedBlockDTO()));
      const searchValue = sameL2L1ChallangedBlocks[0].blockNumber.toString();

      const searchByBlockNumberFactorySpy = jest
        .spyOn(searchService, 'searchByBlockNumberFactory')
        .mockResolvedValueOnce(sameL2L1ChallangedBlocks);
      const result = (await searchService.search(searchValue, SearchTerms.BY_BLOCK_NUMBER)) as SearchResultDTO[];

      expect(searchByBlockNumberFactorySpy).toHaveBeenCalledWith(searchValue);
      expect(result.length).toBe(2);
      expect(result[0].type).toBe(Resources.CHALLENGED_BLOCK_L1);
      expect(result[1].type).toBe(Resources.CHALLENGED_BLOCK);
    });
  });

  describe('Search block number factory', () => {
    it('it should reject search if all promises are rejected', async () => {
      const blockNumberQuerySpy = jest.spyOn(searchService, 'blockNumberQuery').mockRejectedValueOnce('');
      const challengedBlockNumberQuerySpy = jest
        .spyOn(searchService, 'challengedBlockNumberQuery')
        .mockRejectedValueOnce('');

      await expect(searchService.searchByBlockNumberFactory('')).rejects.toEqual(undefined);

      expect(blockNumberQuerySpy).toHaveBeenCalled();
      expect(challengedBlockNumberQuerySpy).toHaveBeenCalled();
    });

    it('it should resolve only blocks', async () => {
      const blockNumberQuerySpy = jest.spyOn(searchService, 'blockNumberQuery').mockResolvedValueOnce([block]);
      const challengedBlockNumberQuerySpy = jest
        .spyOn(searchService, 'challengedBlockNumberQuery')
        .mockRejectedValueOnce('');

      const result = await searchService.searchByBlockNumberFactory(block.blockNumberL2.toString());

      expect(result.length).toBe(1);
      expect(result[0].blockNumberL2).toBe(block.blockNumberL2);
      expect(blockNumberQuerySpy).toHaveBeenCalled();
      expect(challengedBlockNumberQuerySpy).toHaveBeenCalled();
    });

    it('it should resolve only challenged blocks', async () => {
      const blockNumberQuerySpy = jest.spyOn(searchService, 'blockNumberQuery').mockRejectedValueOnce('');
      const challengedBlockNumberQuerySpy = jest
        .spyOn(searchService, 'challengedBlockNumberQuery')
        .mockResolvedValueOnce([challengedBlock]);

      const result = await searchService.searchByBlockNumberFactory(challengedBlock.blockNumberL2.toString());

      expect(result.length).toBe(1);
      expect(result[0].blockNumberL2).toBe(challengedBlock.blockNumberL2);
      expect(blockNumberQuerySpy).toHaveBeenCalled();
      expect(challengedBlockNumberQuerySpy).toHaveBeenCalled();
    });

    it('it should reject if no blocks/challengedBlocks were found', async () => {
      const blockNumberQuerySpy = jest.spyOn(searchService, 'blockNumberQuery').mockResolvedValueOnce([]);
      const challengedBlockNumberQuerySpy = jest
        .spyOn(searchService, 'challengedBlockNumberQuery')
        .mockResolvedValueOnce([]);

      await expect(searchService.searchByBlockNumberFactory('')).rejects.toEqual(undefined);

      expect(blockNumberQuerySpy).toHaveBeenCalled();
      expect(challengedBlockNumberQuerySpy).toHaveBeenCalled();
    });
  });

  describe('Search resource factory', () => {
    it('should search proposer', async () => {
      const proposerQuerySpy = jest.spyOn(searchService, 'proposerQuery').mockResolvedValueOnce(proposer);

      const result = await searchService.seachResourceFactory(proposer.address, SearchTerms.BY_PROPOSER_ADDRESS);

      expect(proposerQuerySpy).toHaveBeenCalledWith(proposer.address);
      expect(result).toMatchObject(proposer);
    });

    it('should reject if proposer not found', async () => {
      jest.spyOn(searchService, 'proposerQuery').mockRejectedValueOnce('');
      await expect(searchService.searchByBlockNumberFactory('')).rejects.toEqual(undefined);
    });

    it('should search block', async () => {
      const blockHashQuerySpy = jest.spyOn(searchService, 'blockHashQuery').mockResolvedValueOnce(block);
      const transactionHashQuerySpy = jest.spyOn(searchService, 'transactionHashQuery').mockRejectedValueOnce('');
      const challengedBlockHashQuerySpy = jest
        .spyOn(searchService, 'challengedBlockHashQuery')
        .mockRejectedValueOnce('');

      const result = await searchService.seachResourceFactory(block.blockHash, SearchTerms.BY_HASH);

      expect(blockHashQuerySpy).toHaveBeenCalledWith(block.blockHash);
      expect(transactionHashQuerySpy).toHaveBeenCalledWith(block.blockHash);
      expect(challengedBlockHashQuerySpy).toHaveBeenCalledWith(block.blockHash);
      expect(result).toMatchObject(block);
    });

    it('should search transaction', async () => {
      const blockHashQuerySpy = jest.spyOn(searchService, 'blockHashQuery').mockRejectedValueOnce('');
      const transactionHashQuerySpy = jest
        .spyOn(searchService, 'transactionHashQuery')
        .mockResolvedValueOnce(transaction);
      const challengedBlockHashQuerySpy = jest
        .spyOn(searchService, 'challengedBlockHashQuery')
        .mockRejectedValueOnce('');

      const result = await searchService.seachResourceFactory(transaction.transactionHash, SearchTerms.BY_HASH);

      expect(blockHashQuerySpy).toHaveBeenCalledWith(transaction.transactionHash);
      expect(transactionHashQuerySpy).toHaveBeenCalledWith(transaction.transactionHash);
      expect(challengedBlockHashQuerySpy).toHaveBeenCalledWith(transaction.transactionHash);
      expect(result).toMatchObject(transaction);
    });

    it('should search challenged block', async () => {
      const blockHashQuerySpy = jest.spyOn(searchService, 'blockHashQuery').mockRejectedValueOnce('');
      const transactionHashQuerySpy = jest.spyOn(searchService, 'transactionHashQuery').mockRejectedValueOnce('');
      const challengedBlockHashQuerySpy = jest
        .spyOn(searchService, 'challengedBlockHashQuery')
        .mockResolvedValueOnce(challengedBlock);

      const result = await searchService.seachResourceFactory(challengedBlock.blockHash, SearchTerms.BY_HASH);

      expect(blockHashQuerySpy).toHaveBeenCalledWith(challengedBlock.blockHash);
      expect(transactionHashQuerySpy).toHaveBeenCalledWith(challengedBlock.blockHash);
      expect(challengedBlockHashQuerySpy).toHaveBeenCalledWith(challengedBlock.blockHash);
      expect(result).toMatchObject(challengedBlock);
    });

    it('should reject if all promises are rejeced', async () => {
      jest.spyOn(searchService, 'blockHashQuery').mockRejectedValueOnce('');
      jest.spyOn(searchService, 'transactionHashQuery').mockRejectedValueOnce('');
      jest.spyOn(searchService, 'challengedBlockHashQuery').mockRejectedValueOnce('');

      await expect(searchService.searchByBlockNumberFactory('')).rejects.toEqual(undefined);
    });
  });

  describe('Challenged block query from block service', () => {
    it('should return challenged block from block service', async () => {
      const queryChallengedBlockSpy = jest
        .spyOn(mockBlockService, 'queryChallengedBlock')
        .mockResolvedValueOnce(challengedBlock);

      const result = await searchService.challengedBlockHashQuery(challengedBlock.blockHash);

      expect(queryChallengedBlockSpy).toHaveBeenCalledWith(HelperService.getBlockHashQuery(challengedBlock.blockHash));
      expect(result).toMatchObject(challengedBlock);
    });

    it('should throw resource not found', async () => {
      jest.spyOn(mockBlockService, 'queryChallengedBlock').mockRejectedValueOnce(new ResourceNotFoundException());

      await expect(searchService.challengedBlockHashQuery(challengedBlock.blockHash)).rejects.toThrowError(
        ResourceNotFoundException
      );
    });
  });

  describe('Block query from block service', () => {
    it('should return block from block service', async () => {
      const queryBlockSpy = jest.spyOn(mockBlockService, 'queryBlock').mockResolvedValueOnce(block);

      const result = await searchService.blockHashQuery(block.blockHash);

      expect(queryBlockSpy).toHaveBeenCalledWith(HelperService.getBlockHashQuery(block.blockHash));
      expect(result).toMatchObject(block);
    });

    it('should throw resource not found', async () => {
      jest.spyOn(mockBlockService, 'queryBlock').mockRejectedValueOnce(new ResourceNotFoundException());

      await expect(searchService.blockHashQuery(block.blockHash)).rejects.toThrowError(ResourceNotFoundException);
    });
  });

  describe('Transaction query from transaction service', () => {
    it('should return transaction from transaction service', async () => {
      const queryTransactionSpy = jest
        .spyOn(mockTransactionService, 'queryTransaction')
        .mockResolvedValueOnce(transaction);

      const result = await searchService.transactionHashQuery(transaction.transactionHash);

      expect(queryTransactionSpy).toHaveBeenCalledWith(HelperService.getTxHashQuery(transaction.transactionHash));
      expect(result).toMatchObject(transaction);
    });

    it('should throw resource not found', async () => {
      jest.spyOn(mockTransactionService, 'queryTransaction').mockRejectedValueOnce(new ResourceNotFoundException());

      await expect(searchService.transactionHashQuery(transaction.transactionHash)).rejects.toThrowError(
        ResourceNotFoundException
      );
    });
  });

  describe('Proposer query from proposer service', () => {
    it('should return proposer from proposer service', async () => {
      const queryProposerSpy = jest.spyOn(mockProposerService, 'queryProposer').mockResolvedValueOnce(proposer);

      const result = await searchService.proposerQuery(proposer.address);

      expect(queryProposerSpy).toHaveBeenCalledWith(proposer.address);
      expect(result).toMatchObject(proposer);
    });

    it('should throw resource not found', async () => {
      jest.spyOn(mockProposerService, 'queryProposer').mockRejectedValueOnce(new ResourceNotFoundException());

      await expect(searchService.proposerQuery(proposer.address)).rejects.toThrowError(ResourceNotFoundException);
    });
  });

  describe('Block query by block number from block service', () => {
    it('should return block from block service', async () => {
      const queryBlockForSearchSpy = jest.spyOn(mockBlockService, 'queryBlockForSearch').mockResolvedValueOnce([block]);

      const result = await searchService.blockNumberQuery(block.blockNumberL2);

      expect(queryBlockForSearchSpy).toHaveBeenCalledWith(HelperService.getBlockNumberQuery(block.blockNumberL2));
      expect(result.length).toBe(1);
    });

    it('should reject if no blocks found', async () => {
      jest.spyOn(mockBlockService, 'queryBlockForSearch').mockResolvedValueOnce([]);

      await expect(searchService.blockNumberQuery(block.blockNumberL2)).rejects.toThrowError(ResourceNotFoundException);
    });
  });

  describe('Challenged block query by block number from block service', () => {
    it('should return challenged block from block service', async () => {
      const queryChallengedBlockForSearchSpy = jest
        .spyOn(mockBlockService, 'queryChallengedBlockForSearch')
        .mockResolvedValueOnce([challengedBlock]);

      const result = await searchService.challengedBlockNumberQuery(challengedBlock.blockNumberL2);

      expect(queryChallengedBlockForSearchSpy).toHaveBeenCalledWith(
        HelperService.getBlockNumberQuery(challengedBlock.blockNumberL2)
      );
      expect(result.length).toBe(1);
    });

    it('should reject if no blocks found', async () => {
      jest.spyOn(mockBlockService, 'queryChallengedBlockForSearch').mockResolvedValueOnce([]);

      await expect(searchService.challengedBlockNumberQuery(challengedBlock.blockNumberL2)).rejects.toThrowError(
        ResourceNotFoundException
      );
    });
  });
});
