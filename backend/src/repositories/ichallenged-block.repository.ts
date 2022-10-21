import { QueryFilter } from '../models';
import { ChallengedBlockDocument } from '../schemas';
import { IBaseRepository } from './ibase.repository';

export interface IChallengedBlockRepository extends IBaseRepository<ChallengedBlockDocument> {
  countChallengedBlocks(filter: QueryFilter): Promise<number>;
}
