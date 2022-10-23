import {
  OrQueryFilter,
  PaginationModel,
  BlockPaginationParams,
  QueryFilter,
  ProposerPaginationParams,
} from '../models';

export interface IBaseRepository<T> {
  findOne(filter: QueryFilter | OrQueryFilter): Promise<T>;
  count(filter?: QueryFilter): Promise<number>;
  findPaginated(paginationParams: BlockPaginationParams | ProposerPaginationParams): Promise<PaginationModel<T>>;
  findAll(filter: QueryFilter | OrQueryFilter): Promise<T[]>;
  paginaton(paginationParams: BlockPaginationParams | ProposerPaginationParams): Promise<PaginationModel<T>>;
}
