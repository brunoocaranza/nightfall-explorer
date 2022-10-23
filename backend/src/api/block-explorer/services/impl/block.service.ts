import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  BlockDTO,
  OrQueryFilter,
  QueryFilter,
  BlockPaginationParams,
  ChallengedBlockDTO,
  BlockItemDTO,
  TransactionItemDTO,
  ChallengedBlockStatsDTO,
  PaginationModel,
} from '../../../../models';
import { IBlockRepository, IChallengedBlockRepository } from '../../../../repositories';
import { BlockSearchFields, HelperService, mapToClass, TransactionSearchFields } from '../../../../utils';
import {
  BLOCK_REPOSITORY,
  BLOCK_SERVICE,
  CHALLENGED_BLOCK_REPOSITORY,
  NOT_APPLICABLE,
  TRANSACTION_SERVICE,
} from '../../../../utils/constants';
import { IBlockService } from '../iblock.service';
import { ITransactionService } from '../itransaction.service';

@Injectable()
export class BlockService implements IBlockService {
  private readonly logger = new Logger(BLOCK_SERVICE);

  constructor(
    @Inject(BLOCK_REPOSITORY) private readonly _blockRepo: IBlockRepository,
    @Inject(TRANSACTION_SERVICE) private readonly _txService: ITransactionService,
    @Inject(CHALLENGED_BLOCK_REPOSITORY) private readonly _challengedBlockRepo: IChallengedBlockRepository
  ) {}

  /**
   * This function returns number and percentage of challenged blocks
   * Percentage of challenged blocks is calculated based on count of good and challenged blocks
   * @returns ChallengedBlockStatsDTO
   */
  async getChallengedBlockStats(): Promise<ChallengedBlockStatsDTO> {
    const [challengedBlocks, blocks] = await Promise.allSettled([
      this._challengedBlockRepo.count(),
      this._blockRepo.count(),
    ]);

    this.logRejectedPromises([challengedBlocks, blocks]);

    const result = new ChallengedBlockStatsDTO();

    if (HelperService.isFullfiledPromise(challengedBlocks))
      result.blocksCount = HelperService.getPromiseValue<number>(challengedBlocks);

    let goodBlocksCount = null;
    if (HelperService.isFullfiledPromise(blocks)) {
      goodBlocksCount = HelperService.getPromiseValue<number>(blocks);
    }

    if (goodBlocksCount && result.blocksCount != NOT_APPLICABLE) {
      result.blockPercentage = HelperService.calculateBlocksPercentage(goodBlocksCount, <number>result.blocksCount);
    }

    return result;
  }

  /**
   * Used to fetch challenged block by L2 block number.
   * Function will populate transactions in BlockDTO manually, because reference in BlockEntity isn't ObjectID
   * @param blockNumber
   * @returns ChallengedBlockDTO
   */
  async findChallangedBlockByNumber(blockNumber: number): Promise<ChallengedBlockDTO> {
    const query: QueryFilter = { [BlockSearchFields.BLOCK_NUMBER_L2]: +blockNumber };
    const block = await this.queryChallengedBlock(query);

    const transactions = await this._txService.queryTransactions({
      [TransactionSearchFields.TRANSACTION_HASH]: { $in: [...block.transactionHashes] },
    });

    block.transactions = transactions.map((tx) => mapToClass<TransactionItemDTO>(tx, TransactionItemDTO));

    // No need to send this on block page
    delete block.transactionHashes;

    return block;
  }

  /**
   * Returns paginated blocks.
   * Pagination docs are converted from BlockDocument[] to BlockItemDTO while the rest of PaginatedResult<T> properties are copied
   * @param paginationParams contains limit, page, sortDirection (default desc) and sortColumn (default timeBlockL2)
   * @returns PaginationModel<BlockItemDTO>
   */
  async findPaginated(paginationParams: BlockPaginationParams): Promise<PaginationModel<BlockItemDTO>> {
    let blocks;

    // badBlocks flag indicates that challenged blocks should be fetched
    if (paginationParams.badBlocks) {
      delete paginationParams.badBlocks; // Remove badBlocks flag because it's not field nor filter param
      blocks = await this._challengedBlockRepo.findPaginated(paginationParams);
    } else blocks = await this._blockRepo.findPaginated(paginationParams);

    return {
      ...blocks,
      docs: blocks.docs.map((block) => {
        return mapToClass(block, BlockItemDTO);
      }),
    };
  }

  /**
   * Count all blocks
   * @returns number
   */
  count(): Promise<number> {
    return this._blockRepo.count();
  }

  /**
   * Used to fetch block by L2 block number.
   * Function will populate transactions in BlockDTO manually, because reference in BlockEntity isn't ObjectID
   * @param blockNumber
   * @returns BlockDTO
   */
  async findBlockByNumber(blockNumber: number): Promise<BlockDTO> {
    const query: QueryFilter = { [BlockSearchFields.BLOCK_NUMBER_L2]: +blockNumber };

    const block = await this.queryBlock(query);

    const transactions = await this._txService.queryTransactions({
      [TransactionSearchFields.TRANSACTION_HASH]: { $in: [...block.transactionHashes] },
    });

    block.transactions = transactions.map((tx) => mapToClass<TransactionItemDTO>(tx, TransactionItemDTO));

    // No need to send this on block page
    delete block.transactionHashes;

    return block;
  }

  /**
   * This method is used for search feature of blocks. There can be cases where 2 blocks have
   * same block number values for blockNumberL1 and blockNumberL2
   * @param query
   */
  async queryBlockForSearch(query: OrQueryFilter | QueryFilter): Promise<BlockDTO[]> {
    const blocks = await this._blockRepo.findAll(query);
    return blocks.map((block) => mapToClass<BlockDTO>(block, BlockDTO));
  }

  /**
   * This method is used for search feature of challenged blocks. There can be cases where 2 blocks have
   * same block number values for blockNumberL1 and blockNumberL2
   * @param query
   */
  async queryChallengedBlockForSearch(query: OrQueryFilter | QueryFilter): Promise<ChallengedBlockDTO[]> {
    const blocks = await this._challengedBlockRepo.findAll(query);
    return blocks.map((block) => mapToClass<ChallengedBlockDTO>(block, ChallengedBlockDTO));
  }

  async queryBlock(query: OrQueryFilter | QueryFilter): Promise<BlockDTO> {
    const block = await this._blockRepo.findOne(query);
    return mapToClass<BlockDTO>(block, BlockDTO);
  }

  async queryChallengedBlock(query: OrQueryFilter | QueryFilter): Promise<ChallengedBlockDTO> {
    const block = await this._challengedBlockRepo.findOne(query);
    return mapToClass<ChallengedBlockDTO>(block, ChallengedBlockDTO);
  }

  logRejectedPromises(settledResults: PromiseSettledResult<number>[]): void {
    settledResults.forEach((result) => {
      if (result.status == 'rejected') {
        this.logger.error(result.reason);
      }
    });
  }
}
