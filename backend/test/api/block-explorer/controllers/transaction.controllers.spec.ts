import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from '../../../../src/api/block-explorer/controllers';
import { PROPOSER_SERVICE, TRANSACTION_SERVICE } from '../../../../src/utils';
import { ResourceNotFoundException } from '../../../../src/utils/exceptions';
import { hash, transaction } from '../../../mocks';

describe('Transaction Controller', () => {
  let transactionController: TransactionController;

  const mockTransactionService = {
    findL2Transaction: jest.fn().mockImplementation((hash: string) => {
      if (hash === null) return Promise.reject(new ResourceNotFoundException('Transaction'));
      return transaction;
    }),
    count: jest.fn().mockReturnValue(5),
  };

  const mockProposerService = {
    getPendingTransactions: jest.fn().mockReturnValue(5),
  };

  let findTransactionSpy;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
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

    transactionController = module.get<TransactionController>(TransactionController);
    findTransactionSpy = jest.spyOn(transactionController, 'findTransaction');
  });

  it('should return transaction by hash', async () => {
    const result = await transactionController.findTransaction(hash);

    expect(mockTransactionService.findL2Transaction).toHaveBeenCalledWith(hash);
    expect(result).toMatchObject(transaction);
    expect(findTransactionSpy).toHaveBeenCalledWith(hash);
  });

  it('should throw ResourceNotFoundException exception', async () => {
    await expect(transactionController.findTransaction(null)).rejects.toThrowError(ResourceNotFoundException);
  });

  it('should count transactions', async () => {
    const result = await transactionController.count();

    expect(mockTransactionService.count).toHaveBeenCalled();
    expect(result).toBe(5);
  });

  it('should count pending transactions', async () => {
    const result = await transactionController.pendingCount();

    expect(mockProposerService.getPendingTransactions).toHaveBeenCalled();
    expect(result).toBe(5);
  });
});
