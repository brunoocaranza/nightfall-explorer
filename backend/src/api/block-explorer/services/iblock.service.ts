import {
  BlockDTO,
  OrQueryFilter,
  BlockPaginationParams,
  QueryFilter,
  ChallengedBlockDTO,
  BlockItemDTO,
  ChallengedBlockStatsDTO,
  PaginationModel,
} from '../../../models';

export interface IBlockService {
  findBlockByNumber(blockNumber: number): Promise<BlockDTO>;
  queryBlock(query: OrQueryFilter | QueryFilter): Promise<BlockDTO>;
  queryBlockForSearch(query: OrQueryFilter | QueryFilter): Promise<BlockDTO[]>;
  findPaginated(paginationParams: BlockPaginationParams): Promise<PaginationModel<BlockItemDTO>>;
  count(): Promise<number>;
  findChallangedBlockByNumber(blockNumber: number): Promise<ChallengedBlockDTO>;
  queryChallengedBlock(query: OrQueryFilter | QueryFilter): Promise<ChallengedBlockDTO>;
  queryChallengedBlockForSearch(query: OrQueryFilter | QueryFilter): Promise<ChallengedBlockDTO[]>;
  getChallengedBlockStats(): Promise<ChallengedBlockStatsDTO>;
}
