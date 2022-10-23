import {
  OrQueryFilter,
  MongooseModel,
  BlockPaginationParams,
  QueryFilter,
  PaginationModel,
  ProposerPaginationParams,
} from '../../models';
import { BlockSearchFields, ProposerSearchFields, Resources } from '../../utils';
import { ResourceNotFoundException } from '../../utils/exceptions';
import { IBaseRepository } from '../ibase.repository';

export abstract class BaseRepository<T> implements IBaseRepository<T> {
  constructor(private readonly _model: MongooseModel<T>, private readonly _resource: Resources) {}

  /**
   * @param filter must be provided in order to fetch only entities that match condition otherwise this will affect performance
   * if all records all fetched
   * @returns T[]
   */
  findAll(filter: QueryFilter | OrQueryFilter): Promise<T[]> {
    return this._model.find(filter, {}, { lean: true }).exec();
  }

  /**
   * Function is only used to paginate blocks and proposer-scoreboard collections
   * Function will apply '-' to sortString if order is desc or in other way will only pass sortColumn string.
   * @param paginationParams contains limit, page, sortDirection (default desc) and sortColumn
   * @returns PaginationModel model
   */
  async findPaginated(paginationParams: BlockPaginationParams | ProposerPaginationParams): Promise<PaginationModel<T>> {
    const sortString =
      paginationParams.sortDirection === 'asc' ? paginationParams.sortColumn : `-${paginationParams.sortColumn}`;

    const query: QueryFilter = {};

    if (paginationParams instanceof BlockPaginationParams) {
      // Pickup default values
      paginationParams = Object.assign(new BlockPaginationParams(), paginationParams);

      // For now only filter is block's proposer. If something new comes make this more dynamic
      if ((paginationParams as BlockPaginationParams).proposer) {
        query[BlockSearchFields.PROPOSER] = (paginationParams as BlockPaginationParams).proposer;
        delete (paginationParams as BlockPaginationParams).proposer;
      }
    } else {
      // Pickup default values
      paginationParams = Object.assign(new ProposerPaginationParams(), paginationParams);
      query[ProposerSearchFields.IS_ACTIVE] = true;

      if ((paginationParams as ProposerPaginationParams).address) {
        // Address field will have list of addresses devided by ,
        const addresses = (paginationParams as ProposerPaginationParams).address.split(',');
        query[ProposerSearchFields.ADDRESS] = { $in: addresses };
      }
    }

    return this._model.paginate(query, { ...paginationParams, sort: sortString, lean: true });
  }

  /**
   * If entity is not found ResourceNotFoundException is throwned
   * @param filter
   * @returns  T
   */
  async findOne(filter: QueryFilter | OrQueryFilter): Promise<T> {
    const entity = await this._model.findOne(filter, {}, { lean: true });
    if (!entity) throw new ResourceNotFoundException(this._resource);
    return entity;
  }

  /**
   * @param filter is by default empty objects which means that function will return total count of documents
   * @returns number
   */
  count(filter: QueryFilter = {}): Promise<number> {
    return this._model.count(filter).exec();
  }
}
