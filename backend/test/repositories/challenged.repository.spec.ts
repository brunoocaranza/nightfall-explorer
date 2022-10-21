import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { ChallengedBlockRepository } from '../../src/repositories';
import { ChallengedBlockEntity } from '../../src/schemas';
import { BlockSearchFields, DATABASE_CONNECTION_NAME } from '../../src/utils';

describe('Challenged Block Repository', () => {
  let challengedBlockRepository: ChallengedBlockRepository;
  let mockChallengedBlockModel = {
    findOne: jest.fn(),
    count: jest.fn(),
    paginate: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ChallengedBlockRepository,
        {
          provide: getModelToken(ChallengedBlockEntity.name, DATABASE_CONNECTION_NAME),
          useValue: mockChallengedBlockModel,
        },
      ],
    }).compile();

    challengedBlockRepository = module.get<ChallengedBlockRepository>(ChallengedBlockRepository);
  });

  it('should be defined', () => {
    expect(challengedBlockRepository).toBeDefined();
  });

  it('should count challenged blocks', async () => {
    const blocksCount = 5;
    const filter = { [BlockSearchFields.PROPOSER]: '0x123513521' };

    const countSpy = jest.spyOn(mockChallengedBlockModel, 'count').mockImplementation(() => {
      return {
        exec: jest.fn(() => Promise.resolve(blocksCount)),
      };
    });

    const result = await challengedBlockRepository.countChallengedBlocks(filter);

    expect(result).toBe(blocksCount);
    expect(countSpy).toHaveBeenCalled();
  });
});
