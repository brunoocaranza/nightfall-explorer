import { Injectable } from '@nestjs/common';
import { DatabaseEntity } from '../../config/database';
import { MongooseModel } from '../../models';
import { TransactionDocument, TransactionEntity } from '../../schemas';
import { Resources } from '../../utils';
import { ITransactionRepository } from '../itransaction.repository';
import { BaseRepository } from './base.repository';

@Injectable()
export class TransactionRepository extends BaseRepository<TransactionDocument> implements ITransactionRepository {
  constructor(
    @DatabaseEntity(TransactionEntity.name) private readonly _transactionModel: MongooseModel<TransactionDocument>
  ) {
    super(_transactionModel, Resources.TRANSACTION);
  }
}
