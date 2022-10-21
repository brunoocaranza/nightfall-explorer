import { OrQueryFilter, QueryFilter, TransactionDTO } from '../../../models';

export interface ITransactionService {
  findL2Transaction(hash: string): Promise<TransactionDTO>;
  queryTransaction(query: QueryFilter | OrQueryFilter): Promise<TransactionDTO>;
  count(): Promise<number>;
  queryTransactions(query: QueryFilter | OrQueryFilter): Promise<TransactionDTO[]>;
}
