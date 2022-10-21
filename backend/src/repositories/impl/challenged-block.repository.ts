import { Injectable } from '@nestjs/common';
import { DatabaseEntity } from '../../config/database';
import { MongooseModel, QueryFilter } from '../../models';
import { ChallengedBlockDocument, ChallengedBlockEntity } from '../../schemas';
import { BlockSearchFields, HelperService, Resources } from '../../utils';
import { IChallengedBlockRepository } from '../ichallenged-block.repository';
import { BaseRepository } from './base.repository';

@Injectable()
export class ChallengedBlockRepository
  extends BaseRepository<ChallengedBlockDocument>
  implements IChallengedBlockRepository
{
  constructor(
    @DatabaseEntity(ChallengedBlockEntity.name)
    private readonly _challengedBlockModel: MongooseModel<ChallengedBlockDocument>
  ) {
    super(_challengedBlockModel, Resources.CHALLENGED_BLOCK);
  }

  /**
   * Used to count challenged blocks which are in 7 days period.
   * @param filter can be proposer address
   * @returns
   */
  countChallengedBlocks(filter: QueryFilter): Promise<number> {
    const weekOldQuery: QueryFilter = {
      [BlockSearchFields.TIME_BLOCK_L2]: { $gte: HelperService.getWeekAgoDate() },
    };

    return this.count({ ...filter, ...weekOldQuery });
  }
}
