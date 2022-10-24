import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { BlockPaginationParams, QueryFilter } from '../../src/models';
import { BlockRepository } from '../../src/repositories';
import { BlockDocument, BlockEntity } from '../../src/schemas';
import { BlockSearchFields, DATABASE_CONNECTION_NAME } from '../../src/utils';
import { ResourceNotFoundException } from '../../src/utils/exceptions';
import { blockEntities, blockEntity, blockEntityPaginated, hash, paginationParams } from '../mocks';

describe('Block Repository', () => {
  let blockRepository: BlockRepository;
  let mockBlockModel = {
    findOne: jest.fn(),
    count: jest.fn(),
    find: jest.fn().mockReturnValue({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
    }),
  };
  const filter: QueryFilter = { blockHash: hash };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        BlockRepository,
        {
          provide: getModelToken(BlockEntity.name, DATABASE_CONNECTION_NAME),
          useValue: mockBlockModel,
        },
      ],
    }).compile();

    blockRepository = module.get<BlockRepository>(BlockRepository);
  });

  it('should be defined', () => {
    expect(blockRepository).toBeDefined();
  });

  it('should find one block', async () => {
    const spy = jest.spyOn(mockBlockModel, 'findOne').mockResolvedValue(blockEntity as BlockDocument);

    const result = await blockRepository.findOne(filter);

    expect(spy).toHaveBeenCalledWith(filter, {}, { lean: true });
    expect(result).toMatchObject(blockEntity);
  });

  it('should throw ResourceNotFoundException', async () => {
    const spy = jest.spyOn(mockBlockModel, 'findOne').mockResolvedValue(null);

    await expect(blockRepository.findOne(filter)).rejects.toThrowError(ResourceNotFoundException);
    expect(spy).toHaveBeenCalledWith(filter, {}, { lean: true });
  });

  it('should return count of blocks', async () => {
    const spy = jest.spyOn(mockBlockModel, 'count').mockImplementation(() => {
      return {
        exec: jest.fn(() => Promise.resolve(10)),
      };
    });
    const result = await blockRepository.count();
    expect(spy).toHaveBeenCalledWith({});
    expect(result).toBe(10);
  });

  it('should return blocks paginated', async () => {
    const totalDocs = 317;
    const countSpy = jest.spyOn(blockRepository, 'count').mockResolvedValueOnce(317);
    const skipSpy = jest.spyOn(mockBlockModel.find(), 'skip');
    const limitSpy = jest.spyOn(mockBlockModel.find(), 'limit');
    const sortSpy = jest.spyOn(mockBlockModel.find(), 'sort');
    const leanSpy = jest.spyOn(mockBlockModel.find(), 'lean').mockResolvedValueOnce(blockEntities);

    const result = await blockRepository.findPaginated(Object.assign(new BlockPaginationParams(), paginationParams));

    expect(result.docs.length).toBe(blockEntities.length);
    expect(result.totalDocs).toBe(totalDocs);
    expect(skipSpy).toHaveBeenCalledWith(paginationParams.limit * (paginationParams.page - 1));
    expect(limitSpy).toHaveBeenCalledWith(paginationParams.limit);
    expect(sortSpy).toHaveBeenCalledWith(`-${paginationParams.sortColumn}`);
    expect(leanSpy).toHaveBeenCalled();
    expect(countSpy).toHaveBeenCalledWith({});
  });

  it('should include proposer in paginate query', async () => {
    const spy = jest.spyOn(mockBlockModel, 'find');
    const proposer = '0xcae0ed659d7821b59bbfd1b6b79260051e5e9111';
    jest.spyOn(mockBlockModel.find(), 'lean').mockResolvedValueOnce(blockEntities);

    await blockRepository.findPaginated(Object.assign(new BlockPaginationParams(), { ...paginationParams, proposer }));

    expect(spy).toHaveBeenCalledWith({ [BlockSearchFields.PROPOSER]: proposer });
  });

  it('should change sort string in pagination if asc passed', async () => {
    const sortSpy = jest.spyOn(mockBlockModel.find(), 'sort');

    const params = new BlockPaginationParams();
    params.sortDirection = 'asc';
    params.limit = paginationParams.limit;
    params.page = paginationParams.page;
    params.sortColumn = paginationParams.sortColumn;

    await blockRepository.findPaginated(params);

    expect(sortSpy).toHaveBeenCalledWith(params.sortColumn);
  });
});
