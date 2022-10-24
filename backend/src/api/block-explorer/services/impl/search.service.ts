import { Inject, Injectable } from '@nestjs/common';
import {
  AnyResource,
  BlockDTO,
  BlockType,
  ChallengedBlockDTO,
  ProposerDTO,
  SearchResultDTO,
  TransactionDTO,
} from '../../../../models';
import {
  BLOCK_SERVICE,
  HelperService,
  mapToClass,
  PROPOSER_SERVICE,
  Resources,
  SearchTerms,
  TRANSACTION_SERVICE,
} from '../../../../utils';
import { ResourceNotFoundException } from '../../../../utils/exceptions';
import { IBlockService } from '../iblock.service';
import { IProposerService } from '../iproposer.service';
import { ISearchService } from '../isearch.service';
import { ITransactionService } from '../itransaction.service';

@Injectable()
export class SearchService implements ISearchService {
  constructor(
    @Inject(BLOCK_SERVICE) private readonly _blockService: IBlockService,
    @Inject(TRANSACTION_SERVICE) private readonly _transactionService: ITransactionService,
    @Inject(PROPOSER_SERVICE) private readonly _proposerService: IProposerService
  ) {}

  /**
   *
   * @param searchParam - search value
   * @param searchTerm - possible search terms. For now it is (hash, block number, proposer url)
   * @returns SearchResultDTO which has info about Type of resource and it's id (transaction hash, block number or proposer url)
   */
  async search(searchParam: string, searchTerm: SearchTerms): Promise<SearchResultDTO | SearchResultDTO[]> {
    try {
      let searchResult: SearchResultDTO | SearchResultDTO[];
      if (searchTerm === SearchTerms.BY_BLOCK_NUMBER) {
        const result = await this.searchByBlockNumberFactory(searchParam);
        searchResult = this.mapBlocksToSearchResult(result, searchParam);
      } else {
        const result = await this.seachResourceFactory(searchParam, searchTerm);
        searchResult = mapToClass(result, SearchResultDTO);
      }

      return searchResult;
    } catch (_) {
      throw new ResourceNotFoundException();
    }
  }

  /**
   * Used to build query based on params and execute them as Promise.allSettled
   * This function executes queries only for searches by blockNumber
   * We need to wait for both promises because there could be overlapping block numbers between valid and invalid blocks
   * @param searchParam - used in mongo query
   * @param searchTerm - determines which predifined search query should be used
   * @returns AnyResource - BlockDTO, TransactionDTO, ProposerDTO, ChallengedBlockDTO
   */
  async searchByBlockNumberFactory(searchParam: string): Promise<BlockType[]> {
    const [blocksPromise, challengedBlocksPromise] = await Promise.allSettled([
      this.blockNumberQuery(+searchParam),
      this.challengedBlockNumberQuery(+searchParam),
    ]);

    // If there is non filfilled promise then reject promise
    if (HelperService.filterFulfilledPromises([blocksPromise, challengedBlocksPromise]).length == 0)
      return Promise.reject();

    const allBlocks: BlockType[] = [];

    // Extract blocks from PromiseSettled
    if (HelperService.isFullfiledPromise(blocksPromise)) {
      allBlocks.push(...HelperService.getPromiseValue<BlockDTO[]>(blocksPromise));
    }

    // Extract challengedBlocks from PromiseSettled
    if (HelperService.isFullfiledPromise(challengedBlocksPromise)) {
      allBlocks.push(...HelperService.getPromiseValue<ChallengedBlockDTO[]>(challengedBlocksPromise));
    }

    // If response is empty from both collections reject promise
    if (allBlocks.length === 0) return Promise.reject();

    return allBlocks;
  }

  /**
   * Used to build query based on params and execute them as Promise.any
   * This function executes queries only for searches by proposer or hash
   * @param searchParam - used in mongo query
   * @param searchTerm - determines which predifined search query should be used
   * @returns AnyResource - BlockDTO, TransactionDTO, ProposerDTO, ChallengedBlockDTO
   */
  async seachResourceFactory(searchParam: string, searchTerm: SearchTerms): Promise<AnyResource> {
    const promises: Promise<AnyResource>[] = [];

    if (searchTerm === SearchTerms.BY_PROPOSER_ADDRESS) promises.push(this.proposerQuery(searchParam));
    else if (searchTerm === SearchTerms.BY_HASH)
      promises.push(
        this.blockHashQuery(searchParam),
        this.transactionHashQuery(searchParam),
        this.challengedBlockHashQuery(searchParam)
      );

    return Promise.any(promises);
  }

  /**
   * Builds block search Query by hash on blockHash field
   * @param hash - string value
   * @returns Promise<BlockDTO> which will be invoked in seachResourceFactory method
   */
  blockHashQuery = (hash: string): Promise<BlockDTO> =>
    this._blockService.queryBlock(HelperService.getBlockHashQuery(hash));

  /**
   * Builds challenged block search Query by hash on blockHash field
   * @param hash - string value
   * @returns Promise<BlockDTO> which will be invoked in seachResourceFactory method
   */
  challengedBlockHashQuery = (hash: string): Promise<ChallengedBlockDTO> =>
    this._blockService.queryChallengedBlock(HelperService.getBlockHashQuery(hash));

  /**
   * Builds block searh OrQuery by blockNumber on blockNumber and blockNumberL2 fields
   * @param blockNumber - number value
   * @returns Promise<BlockDTO[]> which will be invoked in seachResourceFactory method
   */
  blockNumberQuery = async (blockNumber: number): Promise<BlockDTO[]> => {
    const blocks = await this._blockService.queryBlockForSearch(HelperService.getBlockNumberQuery(blockNumber));
    let resolve;

    if (!blocks.length) resolve = Promise.reject(new ResourceNotFoundException(Resources.BLOCK));
    else resolve = Promise.resolve(blocks);
    return resolve;
  };

  /**
   * Builds challenged block searh OrQuery by blockNumber on blockNumber and blockNumberL2 fields
   * @param blockNumber - number value
   * @returns Promise<ChallengedBlockDTO[]> which will be invoked in seachResourceFactory method
   */
  challengedBlockNumberQuery = async (blockNumber: number): Promise<ChallengedBlockDTO[]> => {
    const blocks = await this._blockService.queryChallengedBlockForSearch(
      HelperService.getBlockNumberQuery(blockNumber)
    );
    let resolve;

    if (!blocks.length) resolve = Promise.reject(new ResourceNotFoundException(Resources.CHALLENGED_BLOCK));
    else resolve = Promise.resolve(blocks);
    return resolve;
  };

  /**
   * Builds transaction searh OrQuery by hash on transactionHash and transactionHashL1 fields
   * @param hash - string value
   * @returns Promise<TransactionDTO> which will be invoked in seachResourceFactory method
   */
  transactionHashQuery = (hash: string): Promise<TransactionDTO> =>
    this._transactionService.queryTransaction(HelperService.getTxHashQuery(hash));

  /**
   * Builds proposer searh Query by url on url field
   * @param address
   * @returns
   */
  proposerQuery = (address: string): Promise<ProposerDTO> => this._proposerService.queryProposer(address);

  /**
   * Used to map array of blocks (or challenged blocks) to search result object. If search param matches
   * L1 block number from one of the blocks then searchResult.type will have [block || challenged_block]_l1
   * which means that search query found 2 blocks with same blockNumberL2 and blockNumber.
   * @param blocks could be BlockDTO[] || ChallengedBlockDTO[]
   * @param searchParam
   * @returns SearchResultDTO[]
   */
  private mapBlocksToSearchResult(blocks: BlockType[], searchParam: string): SearchResultDTO[] {
    const searchResult: SearchResultDTO[] = [];
    for (const block of blocks) {
      const resultBlock = mapToClass(block, SearchResultDTO);
      // If search param is equal to block number then set type to be L1
      if (this.isL1BlockNumberMatch(block.blockNumber, searchParam)) resultBlock.type = this.setSearchResultType(block);
      searchResult.push(resultBlock);
    }

    return searchResult;
  }

  private isL1BlockNumberMatch(blockNumber: number, searchParam: string): boolean {
    return blockNumber.toString() === searchParam;
  }

  private setSearchResultType(block: BlockType): Resources {
    if (block instanceof ChallengedBlockDTO || block['invalidCode'] != undefined) return Resources.CHALLENGED_BLOCK_L1;
    return Resources.BLOCK_L1;
  }
}
