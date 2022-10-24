import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { BlockPaginationParams, QueryFilter } from '../../src/models';
import { BlockRepository } from '../../src/repositories';
import { BlockDocument, BlockEntity } from '../../src/schemas';
import { BlockSearchFields, DATABASE_CONNECTION_NAME } from '../../src/utils';
import { ResourceNotFoundException } from '../../src/utils/exceptions';
import { blockEntity, blockEntityPaginated, hash, paginationParams } from '../mocks';

describe('Block Repository', () => {
  let blockRepository: BlockRepository;
  let mockBlockModel = {
    findOne: jest.fn(),
    count: jest.fn(),
    find: jest.fn(() => {
      skip: jest.fn(() => {
        limit: jest.fn(() => {
          sort: jest.fn(() => {
            lean: jest.fn(() => {});
          });
        });
      });
    }),
    paginate: jest.fn().mockReturnValue({
      docs: [],
      totalDocs: 317,
      limit: 2,
      totalPages: 32,
      page: 1,
      pagingCounter: 3,
      hasPrevPage: false,
      hasNextPage: true,
      prevPage: 0,
      nextPage: 2,
      offset: 1,
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
    const countSpy = jest.spyOn(mockBlockModel, 'count').mockResolvedValueOnce(317);
    const spy = jest.spyOn(mockBlockModel, 'paginate');

    const result = await blockRepository.findPaginated(Object.assign(new BlockPaginationParams(), paginationParams));
    expect(spy).toHaveBeenCalledWith({}, { ...paginationParams, sort: `-${paginationParams.sortColumn}`, lean: true });
    expect(result).toMatchObject({ ...blockEntityPaginated, docs: [] });
    expect(countSpy).toHaveBeenCalled();
  });

  it('should include proposer in paginate query', async () => {
    const spy = jest.spyOn(mockBlockModel, 'paginate');
    const proposer = '0xcae0ed659d7821b59bbfd1b6b79260051e5e9111';

    await blockRepository.findPaginated(Object.assign(new BlockPaginationParams(), { ...paginationParams, proposer }));

    expect(spy).toHaveBeenCalledWith(
      { [BlockSearchFields.PROPOSER]: proposer },
      {
        limit: paginationParams.limit,
        sortDirection: paginationParams.sortDirection,
        sortColumn: paginationParams.sortColumn,
        page: paginationParams.page,
        sort: `-${paginationParams.sortColumn}`,
        lean: true,
      }
    );
  });

  it('should change sort string in pagination if asc passed', async () => {
    const spy = jest.spyOn(mockBlockModel, 'paginate');

    const params = new BlockPaginationParams();
    params.sortDirection = 'asc';
    params.limit = paginationParams.limit;
    params.page = paginationParams.page;
    params.sortColumn = paginationParams.sortColumn;

    await blockRepository.findPaginated(params);

    expect(spy).toHaveBeenCalledWith(
      {},
      {
        limit: paginationParams.limit,
        sortDirection: params.sortDirection,
        sortColumn: paginationParams.sortColumn,
        page: paginationParams.page,
        sort: paginationParams.sortColumn,
        lean: true,
      }
    );
  });
});
