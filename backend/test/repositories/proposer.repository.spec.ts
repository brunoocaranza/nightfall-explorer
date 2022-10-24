import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { ProposerPaginationParams } from '../../src/models';
import { ProposerRepository } from '../../src/repositories';
import { ProposerEntity } from '../../src/schemas';
import { DATABASE_CONNECTION_NAME, ProposerSearchFields } from '../../src/utils';

describe('Proposer Repository', () => {
  let proposerRepository: ProposerRepository;
  let mockProposerModel = {
    find: jest.fn().mockReturnValue({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
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
    const countSpy = jest.spyOn(proposerRepository, 'count').mockResolvedValueOnce(317);
    const spy = jest.spyOn(mockProposerModel, 'find');

    const params = new ProposerPaginationParams();
    params.sortDirection = 'asc';
    params.limit = 2;
    params.page = 1;
    params.sortColumn = 'goodBlocks';

    await proposerRepository.findPaginated(params);

    expect(spy).toHaveBeenCalledWith({ isActive: true });
    expect(countSpy).toHaveBeenCalledWith({ isActive: true });
  });

  it('should should include address in query', async () => {
    const countSpy = jest.spyOn(proposerRepository, 'count').mockResolvedValueOnce(317);
    const spy = jest.spyOn(mockProposerModel, 'find');

    const params = new ProposerPaginationParams();
    params.sortDirection = 'asc';
    params.limit = 2;
    params.page = 1;
    params.sortColumn = 'goodBlocks';
    params.address = '0x1231231232';

    await proposerRepository.findPaginated(params);

    expect(spy).toHaveBeenCalledWith({ isActive: true, [ProposerSearchFields.ADDRESS]: { $in: [params.address] } });
    expect(countSpy).toHaveBeenCalledWith({
      isActive: true,
      [ProposerSearchFields.ADDRESS]: { $in: [params.address] },
    });
  });
});
