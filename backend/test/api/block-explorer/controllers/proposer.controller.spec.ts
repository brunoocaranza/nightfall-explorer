import { Test, TestingModule } from '@nestjs/testing';
import { ProposerController } from '../../../../src/api/block-explorer/controllers';
import { PaginationModel, ProposerItemDTO } from '../../../../src/models';
import { PROPOSER_SERVICE, Resources } from '../../../../src/utils';
import { ResourceNotFoundException } from '../../../../src/utils/exceptions';
import { proposer, proposerPaginated, proposerPaginationParams } from '../../../mocks';

describe('Proposer Controller', () => {
  let proposerController: ProposerController;

  const mockProposerService = {
    getProposerInfo: jest.fn(),
    findPaginated: jest.fn(),
    getProposerAddresses: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProposerController],
      providers: [
        {
          provide: PROPOSER_SERVICE,
          useValue: mockProposerService,
        },
      ],
    }).compile();

    proposerController = module.get<ProposerController>(ProposerController);
  });

  describe('Proposer info api', () => {
    it('should return proposer info by passed address', async () => {
      const getProposerInfoSpy = jest.spyOn(mockProposerService, 'getProposerInfo').mockResolvedValue(proposer);
      const result = await proposerController.findProposer(proposer.address);

      expect(result).toMatchObject(proposer);
      expect(getProposerInfoSpy).toHaveBeenCalledWith(proposer.address);
    });

    it("should throw ResourceNotFoundException if proposer by passed address doesn't exist", async () => {
      jest
        .spyOn(mockProposerService, 'getProposerInfo')
        .mockRejectedValue(new ResourceNotFoundException(Resources.PROPOSER));
      try {
        await proposerController.findProposer(null);
      } catch (error) {
        expect(error).toMatchObject(new ResourceNotFoundException(Resources.PROPOSER));
      }
    });
  });

  it('should return paginated proposers', async () => {
    const findPaginatedSpy = jest.spyOn(mockProposerService, 'findPaginated').mockResolvedValueOnce(proposerPaginated);
    const result: PaginationModel<ProposerItemDTO> = await proposerController.findPaginated(proposerPaginationParams);

    expect(findPaginatedSpy).toHaveBeenCalledWith(proposerPaginationParams);
    expect(result.docs.length).toBe(proposerPaginated.docs.length);
    expect(result.hasPrevPage).toBe(false);
    expect(result.hasNextPage).toBe(true);
  });

  it('should return array of proposer addresses', async () => {
    const address = '0xCaE0ed659d7821b59bBFd1b6B79260051e5E9111';
    const getProposerAddressesSpy = jest
      .spyOn(mockProposerService, 'getProposerAddresses')
      .mockResolvedValueOnce([address]);

    const result = await proposerController.getProposerAddresses();
    expect(getProposerAddressesSpy).toHaveBeenCalled();
    expect(result).toMatchObject([address]);
  });
});
