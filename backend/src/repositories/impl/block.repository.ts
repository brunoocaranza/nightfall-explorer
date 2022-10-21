import { Injectable } from '@nestjs/common';
import { DatabaseEntity } from '../../config/database';
import { MongooseModel } from '../../models';
import { BlockDocument, BlockEntity } from '../../schemas';
import { Resources } from '../../utils';
import { IBlockRepository } from '../iblock.repository';
import { BaseRepository } from './base.repository';

@Injectable()
export class BlockRepository extends BaseRepository<BlockDocument> implements IBlockRepository {
  constructor(@DatabaseEntity(BlockEntity.name) private readonly _blockModel: MongooseModel<BlockDocument>) {
    super(_blockModel, Resources.BLOCK);
  }
}
