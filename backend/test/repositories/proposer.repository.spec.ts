import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { ProposerPaginationParams } from '../../src/models';
import { ProposerRepository } from '../../src/repositories';
import { ProposerEntity } from '../../src/schemas';
import { DATABASE_CONNECTION_NAME } from '../../src/utils';

describe('Proposer Repository', () => {
  let proposerRepository: ProposerRepository;
  let mockProposerModel = {
    paginate: jest.fn().mockReturnValue({
      docs: [],
      totalDocs: 4,
      limit: 2,
      totalPages: 2,
      page: 1,
      pagingCounter: 1,
      hasPrevPage: false,
      hasNextPage: true,
      prevPage: 0,
      nextPage: 2,
      offset: 1,
    }),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ProposerRepository,
        {
          provide: getModelToken(ProposerEntity.name, DATABASE_CONNECTION_NAME),
          useValue: mockProposerModel,
        },
      ],
    }).compile();

    proposerRepository = module.get<ProposerRepository>(ProposerRepository);
  });

  it('should be defined', () => {
    expect(proposerRepository).toBeDefined();
  });

  it('should find proposers paginated', async () => {
    const spy = jest.spyOn(mockProposerModel, 'paginate');

    const params = new ProposerPaginationParams();
    params.sortDirection = 'asc';
    params.limit = 2;
    params.page = 1;
    params.sortColumn = 'goodBlocks';

    await proposerRepository.findPaginated(params);

    expect(spy).toHaveBeenCalledWith(
      { isActive: true },
      {
        limit: params.limit,
        sortDirection: params.sortDirection,
        sortColumn: params.sortColumn,
        page: params.page,
        sort: params.sortColumn,
        lean: true,
      }
    );
  });

  it('should should include address in query', async () => {
    const spy = jest.spyOn(mockProposerModel, 'paginate');

    const params = new ProposerPaginationParams();
    params.sortDirection = 'asc';
    params.limit = 2;
    params.page = 1;
    params.sortColumn = 'goodBlocks';
    params.address = '0x1231231232';

    await proposerRepository.findPaginated(params);

    expect(spy).toHaveBeenCalled();
  });
});
