import { Test, TestingModule } from '@nestjs/testing';
import { SearchController } from '../../../../src/api/block-explorer/controllers';
import { SearchTerms, SEARCH_SERVICE } from '../../../../src/utils';
import { ResourceNotFoundException } from '../../../../src/utils/exceptions';
import { searchResultBlock } from '../../../mocks';

describe('Search Controller', () => {
  let searchController: SearchController;

  const mockSearchService = {
    search: jest.fn().mockImplementation((searchParam: string, searchTerm: SearchTerms) => {
      if (searchParam === null || searchTerm === null) return Promise.reject(new ResourceNotFoundException());
      return searchResultBlock;
    }),
  };

  const blockNumber = searchResultBlock.value.toString();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [
        {
          provide: SEARCH_SERVICE,
          useValue: mockSearchService,
        },
      ],
    }).compile();

    searchController = module.get<SearchController>(SearchController);
  });

  it('should return search result by block number', async () => {
    const result = await searchController.search(blockNumber, {
      searchTerm: SearchTerms.BY_BLOCK_NUMBER,
    });

    expect(mockSearchService.search).toHaveBeenCalledWith(blockNumber, SearchTerms.BY_BLOCK_NUMBER);
    expect(result).toMatchObject(searchResultBlock);
  });

  it('should throw ResourceNotFoundException exception', async () => {
    await expect(searchController.search(null, { searchTerm: null })).rejects.toThrowError(ResourceNotFoundException);
  });
});
