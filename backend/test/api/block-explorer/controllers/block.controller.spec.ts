import { Test, TestingModule } from '@nestjs/testing';
import { BlockController } from '../../../../src/api/block-explorer/controllers';
import { AverageBlockCreationDTO, ChallengedBlockStatsDTO } from '../../../../src/models';
import { BLOCK_CREATION_SERVICE, BLOCK_SERVICE } from '../../../../src/utils';
import { ResourceNotFoundException } from '../../../../src/utils/exceptions';
import { averageBlockCreation, block, blockPaginated, challengedBlock, paginationParams } from '../../../mocks';

describe('Block Controller', () => {
  let blockController: BlockController;
  const mockBlockService = {
    findBlockByNumber: jest.fn().mockImplementation((blockNumber: number) => {
      if (blockNumber === null) return Promise.reject(new ResourceNotFoundException('Block'));
      return block;
    }),
    findPaginated: jest.fn().mockImplementation((paginationParams) => {
      return blockPaginated;
    }),
    count: jest.fn().mockReturnValue(5),
    findChallangedBlockByNumber: jest.fn().mockImplementation((blockNumber: number) => {
      if (blockNumber === null) return Promise.reject(new ResourceNotFoundException('Challanged-block'));
      return challengedBlock;
    }),
    getChallengedBlockStats: jest.fn(),
  };

  const mockBlockCreationService = {
    findAverageBlockCreation: jest.fn().mockReturnValue(averageBlockCreation),
  };

  const blockNumber = block.blockNumberL2;
  let findBlockByNumberSpy;
  let findPaginatedSpy;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlockController],
      providers: [
        {
          provide: BLOCK_SERVICE,
          useValue: mockBlockService,
        },
        {
          provide: BLOCK_CREATION_SERVICE,
          useValue: mockBlockCreationService,
        },
      ],
    }).compile();

    blockController = module.get<BlockController>(BlockController);
    findBlockByNumberSpy = jest.spyOn(mockBlockService, 'findBlockByNumber');
    findPaginatedSpy = jest.spyOn(mockBlockService, 'findPaginated');
  });

  it('should return block by block number', async () => {
    const result = await blockController.findBlock(blockNumber);

    expect(mockBlockService.findBlockByNumber).toHaveBeenCalledWith(blockNumber);
    expect(result).toMatchObject(block);
    expect(findBlockByNumberSpy).toHaveBeenCalledWith(blockNumber);
  });

  it('should throw ResourceNotFoundException exception on find block', async () => {
    await expect(blockController.findBlock(null)).rejects.toThrowError(ResourceNotFoundException);
  });

  it('should return blocks paginated', async () => {
    const result = await blockController.findPaginated(paginationParams);

    expect(result.docs.length).toBe(blockPaginated.docs.length);
    expect(result).toMatchObject(blockPaginated);
    expect(findPaginatedSpy).toHaveBeenCalledWith(paginationParams);
  });

  it('should count blocks', async () => {
    const result = await blockController.count();

    expect(mockBlockService.count).toHaveBeenCalled();
    expect(result).toBe(5);
  });

  it('should return block by block number', async () => {
    const findChallengedBlockByNumberSpy = jest.spyOn(mockBlockService, 'findChallangedBlockByNumber');
    const result = await blockController.findChallangedBlock(challengedBlock.blockNumberL2);

    expect(mockBlockService.findChallangedBlockByNumber).toHaveBeenCalledWith(challengedBlock.blockNumberL2);
    expect(result).toMatchObject(challengedBlock);
    expect(findChallengedBlockByNumberSpy).toHaveBeenCalledWith(challengedBlock.blockNumberL2);
  });

  it('should throw ResourceNotFoundException exception on find challenged block', async () => {
    await expect(blockController.findChallangedBlock(null)).rejects.toThrowError(ResourceNotFoundException);
  });

  it('should return average block creation dto', async () => {
    const result = (await blockController.averageBlockCreation()) as AverageBlockCreationDTO;

    expect(result.timeUnit).toBe(averageBlockCreation.timeUnit);
    expect(result.value).toBe(averageBlockCreation.value);
  });

  it('should return challenged blocks stats dto', async () => {
    const expected: ChallengedBlockStatsDTO = {
      blockPercentage: 2,
      blocksCount: 5,
    };
    const getChallengedBlockStatsSpy = jest
      .spyOn(mockBlockService, 'getChallengedBlockStats')
      .mockReturnValueOnce(expected);

    const result = await blockController.getChallengedBlockStats();

    expect(result).toMatchObject(expected);
    expect(getChallengedBlockStatsSpy).toHaveBeenCalled();
  });
});
