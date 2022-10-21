import { Inject, Injectable } from '@nestjs/common';
import { TransactionDTO, QueryFilter, OrQueryFilter } from '../../../../models';
import { ITransactionRepository } from '../../../../repositories';
import { mapToClass, TransactionSearchFields } from '../../../../utils';
import { TRANSACTION_REPOSITORY } from '../../../../utils/constants';
import { ITransactionService } from '../itransaction.service';

@Injectable()
export class TransactionService implements ITransactionService {
  constructor(@Inject(TRANSACTION_REPOSITORY) private readonly _transactionRepo: ITransactionRepository) {}

  /**
   * Count all transactions
   * @returns number
   */
  count(): Promise<number> {
    return this._transactionRepo.count();
  }

  async findL2Transaction(hash: string): Promise<TransactionDTO> {
    const tx = await this.queryTransaction({ [TransactionSearchFields.TRANSACTION_HASH]: hash });

    // Don't display recipient if this condition is evaluated
    tx.invalidRecipientAddress() && delete tx.recipientAddress;

    // Determine transaction status
    tx.setTxStatus();

    return tx;
  }

  /**
   * This method is used by other services
   */
  async queryTransaction(query: QueryFilter | OrQueryFilter): Promise<TransactionDTO> {
    const transaction = await this._transactionRepo.findOne(query);
    return mapToClass<TransactionDTO>(transaction, TransactionDTO);
  }

  async queryTransactions(query: QueryFilter | OrQueryFilter): Promise<TransactionDTO[]> {
    const transactions = await this._transactionRepo.findAll(query);
    return transactions.map((tx) => mapToClass<TransactionDTO>(tx, TransactionDTO));
  }
}
