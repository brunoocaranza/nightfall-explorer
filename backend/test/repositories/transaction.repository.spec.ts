import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { QueryFilter } from '../../src/models';
import { TransactionRepository } from '../../src/repositories';
import { TransactionDocument, TransactionEntity } from '../../src/schemas';
import { BlockSearchFields, DATABASE_CONNECTION_NAME } from '../../src/utils';
import { ResourceNotFoundException } from '../../src/utils/exceptions';
import { transactionEntity, hash, transactionEntities, blockEntity } from '../mocks';

describe('Transaction Repository', () => {
  let transactionRepository: TransactionRepository;
  let mockTransactionModel = {
    count: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };
  const filter: QueryFilter = { transactionHash: hash };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TransactionRepository,
        { provide: getModelToken(TransactionEntity.name, DATABASE_CONNECTION_NAME), useValue: mockTransactionModel },
      ],
    }).compile();

    transactionRepository = module.get<TransactionRepository>(TransactionRepository);
  });

  it('should be defined', () => {
    expect(transactionRepository).toBeDefined();
  });

  it('should find one transaction', async () => {
    const spy = jest.spyOn(mockTransactionModel, 'findOne').mockResolvedValue(transactionEntity as TransactionDocument);

    const result = await transactionRepository.findOne({ transactionHash: hash });

    expect(spy).toHaveBeenCalledWith(filter, {}, { lean: true });
    expect(result).toMatchObject(transactionEntity);
  });

  it('should throw ResourceNotFoundException', async () => {
    const spy = jest.spyOn(mockTransactionModel, 'findOne').mockResolvedValue(null);

    await expect(transactionRepository.findOne({ transactionHash: hash })).rejects.toThrowError(
      ResourceNotFoundException
    );
    expect(spy).toHaveBeenCalledWith(filter, {}, { lean: true });
  });

  it('should return count of transactions', async () => {
    const spy = jest.spyOn(mockTransactionModel, 'count').mockImplementation(() => {
      return {
        exec: jest.fn(() => Promise.resolve(10)),
      };
    });
    const result = await transactionRepository.count();
    expect(spy).toHaveBeenCalledWith({});
    expect(result).toBe(10);
  });

  it('should return all transactions by passed query', async () => {
    const spy = jest.spyOn(mockTransactionModel, 'find').mockImplementation(() => {
      return {
        exec: jest.fn(() => Promise.resolve(transactionEntities)),
      };
    });
    const query = { [BlockSearchFields.BLOCK_NUMBER_L2]: blockEntity.blockNumberL2 };

    const result = await transactionRepository.findAll(query);
    expect(spy).toHaveBeenCalledWith(query, {}, { lean: true });
    expect(result).toMatchObject(transactionEntities);
  });
});
