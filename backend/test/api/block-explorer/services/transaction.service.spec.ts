import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from '../../../../src/api/block-explorer/services';
import { QueryFilter } from '../../../../src/models';
import { TransactionSearchFields, TRANSACTION_REPOSITORY } from '../../../../src/utils';
import { transaction, transactionEntities, transactionEntity } from '../../../mocks';

describe('Transaction Service', () => {
  let transactionService: TransactionService;

  const filter: QueryFilter = { [TransactionSearchFields.TRANSACTION_HASH]: transaction.transactionHash };

  const mockTransactionRepository = {
    findOne: jest.fn().mockReturnValue(transactionEntity),
    count: jest.fn().mockReturnValue(5),
    findAll: jest.fn().mockResolvedValue(transactionEntities),
  };

  const mockConfigService = {
    get: jest.fn().mockImplementation((key) => {
      if (key == 'network.name') return 'TESTNET';
      else if (key == 'network.ethScanUrl') return 'https://ethscan.io';
      else if (key == 'network.goerliScanUrl') return 'https://goerli.ethscan.io';
      else return '';
    }),
  };

  let findL2TransactionSpy;
  let queryTransactionSpy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: TRANSACTION_REPOSITORY,
          useValue: mockTransactionRepository,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    transactionService = module.get<TransactionService>(TransactionService);
    findL2TransactionSpy = jest.spyOn(transactionService, 'findL2Transaction');
    queryTransactionSpy = jest.spyOn(transactionService, 'queryTransaction');
  });

  it('should find transaction by hash', async () => {
    const result = await transactionService.findL2Transaction(transaction.transactionHash);

    expect(mockTransactionRepository.findOne).toHaveBeenCalledWith(filter);
    expect(mockTransactionRepository.findOne).toHaveReturnedWith(transactionEntity);
    expect(findL2TransactionSpy).toHaveBeenCalledWith(transaction.transactionHash);
    expect(queryTransactionSpy).toHaveBeenCalledWith(filter);

    expect(result.tokenType).toBe(transaction.tokenType);
    expect(result.hasEthScanLink).toBe(true);
    expect(result.recipientAddress).toBeUndefined();
  });

  it('should query transaction by QueryFilter', async () => {
    const result = await transactionService.findL2Transaction(transaction.transactionHash);

    expect(mockTransactionRepository.findOne).toHaveBeenCalledWith(filter);
    expect(mockTransactionRepository.findOne).toHaveReturnedWith(transactionEntity);
    expect(queryTransactionSpy).toHaveBeenCalledWith(filter);

    expect(result.tokenType).toBe(transaction.tokenType);
    expect(result.hasEthScanLink).toBe(true);
    expect(result.recipientAddress).toBeUndefined();
  });

  it('should count blocks', async () => {
    const result = await transactionService.count();

    expect(mockTransactionRepository.count).toHaveBeenCalledWith();
    expect(mockTransactionRepository.count).toHaveReturnedWith(5);
    expect(result).toBe(5);
  });

  it('should include recipient address in transaction dto', async () => {
    const recipientAddress = '0xfCb059A4dB5B961d3e48706fAC91a55Bad0035C9';
    jest.spyOn(mockTransactionRepository, 'findOne').mockReturnValueOnce({ ...transactionEntity, recipientAddress });
    const result = await transactionService.findL2Transaction(transaction.transactionHash);

    expect(result.recipientAddress).toBe(recipientAddress);
  });

  it('should have null as transaction status', async () => {
    const transactionType = '0x0000000000000000000000000000000000000000000000000000000000000001';
    jest.spyOn(mockTransactionRepository, 'findOne').mockReturnValueOnce({ ...transactionEntity, transactionType });
    const result = await transactionService.findL2Transaction(transaction.transactionHash);

    expect(result.status).toBe(null);
  });

  it('should return array of tx dtos', async () => {
    const filter = {
      [TransactionSearchFields.TRANSACTION_HASH]: { $in: transactionEntities.map((tx) => tx.transactionHash) },
    };
    const findAllSpy = jest.spyOn(mockTransactionRepository, 'findAll');

    const result = await transactionService.queryTransactions(filter);

    expect(findAllSpy).toHaveBeenCalledWith(filter);
    expect(result.length).toBe(transactionEntities.length);
  });

  it('should have empty ethScanLink if tx is offchain', async () => {
    const findOneResponse = Object.assign({}, transactionEntity);
    findOneResponse.transactionHashL1 = 'offchain';
    jest.spyOn(mockTransactionRepository, 'findOne').mockResolvedValueOnce(findOneResponse);

    const result = await transactionService.findL2Transaction('');

    expect(result.hasEthScanLink).toBe(false);
  });
});
