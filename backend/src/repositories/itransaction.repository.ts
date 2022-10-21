import { TransactionDocument } from '../schemas';
import { IBaseRepository } from './ibase.repository';

export type ITransactionRepository = IBaseRepository<TransactionDocument>;
