import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  CHALLENGED_BLOCK_REPOSITORY,
  CONTRACT_CLIENT_SERVICE,
  NOT_APPLICABLE,
  PROPOSER_REPOSITORY,
  PROPOSER_SERVICE_CTX,
} from '../../../../utils/constants';
import { IContractClientService } from '../icontract-client.service';
import { IProposerService } from '../iproposer.service';
import {
  PaginationModel,
  ProposerBuilder,
  ProposerDTO,
  ProposerItemDTO,
  ProposerPaginationParams,
} from '../../../../models';
import { BlockSearchFields, mapToClass, ProposerSearchFields } from '../../../../utils';
import { IChallengedBlockRepository, IProposerRepository } from '../../../../repositories';
import { PROPOSER_FEES_ERROR, PROPOSER_MEMPOOL_ERROR } from '../../../../utils/exceptions';
import { CronExpression } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { IInitService } from '../iinit.service';

@Injectable()
export class ProposerService implements IProposerService, IInitService {
  private readonly logger = new Logger(PROPOSER_SERVICE_CTX);
  private numberOfPendingTxs: string | number;

  constructor(
    @Inject(CONTRACT_CLIENT_SERVICE) private readonly _contractClient: IContractClientService,
    @Inject(CHALLENGED_BLOCK_REPOSITORY) private _challengedBlockRepo: IChallengedBlockRepository,
    @Inject(PROPOSER_REPOSITORY) private readonly _proposerRepo: IProposerRepository,
    private readonly _httpService: HttpService
  ) {}

  async init(): Promise<void> {
    this.logger.log(`[${PROPOSER_SERVICE_CTX}] service initialization`);
    await this.setNumberOfPendingTransactions();
    this.startCronJob();
  }

  /**
   * Used to retrieve list of all addresses
   * @returns
   */
  async getProposerAddresses(): Promise<string[]> {
    const proposers = await this._proposerRepo.findAll({ [ProposerSearchFields.IS_ACTIVE]: true });
    return proposers.map((proposer) => proposer.address);
  }

  /**
   * Returns paginated proposers.
   * Pagination docs are converted from ProposerDocument[] to ProposerItemDTO, the rest of PaginatedResult<T> properties is copied
   * @param paginationParams contains limit, page, sortDirection (default desc) and sortColumn (goodBlocks | badBlocks)
   * @returns PaginationModel<ProposerItemDTO>
   */
  async findPaginated(paginationParams: ProposerPaginationParams): Promise<PaginationModel<ProposerItemDTO>> {
    const proposers = await this._proposerRepo.findPaginated(paginationParams);

    return {
      ...proposers,
      docs: proposers.docs.map((proposer) => {
        return mapToClass(proposer, ProposerItemDTO);
      }),
    };
  }

  /**
   * This functions gatters infromations about proposer stats (fee, good & bad & challenged blocks).
   * They are called using allSettled so if some of queries fails corresponding field will have N/A value
   * @param address
   * @returns
   */
  async getProposerInfo(address: string): Promise<ProposerDTO> {
    // Query proposer will throw NotFound if proposer with passed address doesn't exist
    let proposer = await this.queryProposer(address);

    // Be aware of promise's order
    const [fee, challengedBlocks]: PromiseSettledResult<number>[] = await Promise.allSettled([
      this.getProposerFee(proposer.url),
      this.countChallengedBlocks(proposer.address),
    ]);

    this.logRejectedPromises([fee, challengedBlocks]);

    const builder = new ProposerBuilder().setStats(proposer.stats).setFee(fee).setChallengedBlocks(challengedBlocks);

    proposer = {
      ...proposer,
      ...builder,
    };

    return proposer;
  }

  /**
   * Retrieves pending txs either from class variable or from calling proposer
   * @returns
   */
  async getPendingTransactions(): Promise<number | string> {
    if (this.numberOfPendingTxs != undefined || this.numberOfPendingTxs != null) return this.numberOfPendingTxs;
    return this.countPendingTransactions();
  }

  /**
   * This function is calling current proposer from contract and uses it's url to get pending transactions
   * In case that something went wrong then error will be printed and default value (N/A) will be returned
   * @returns number of pending transactions
   */
  async countPendingTransactions(): Promise<number | string> {
    try {
      const proposer = await this._contractClient.getCurrentProposer();
      const numOfTx = (await this.getProposerMempool(proposer.url)).length;
      return numOfTx;
    } catch (error) {
      this.logger.error(error);
      return NOT_APPLICABLE;
    }
  }

  /**
   * This function is calling proposer's mempool and it returns array of pending transactions
   * @param url - proposer's url
   */
  async getProposerMempool(url: string): Promise<Record<string, string>[]> {
    try {
      const { data } = await this._httpService.axiosRef.get(`${url}/proposer/mempool`);
      return data['mempoolTransactions'];
    } catch (_) {
      return Promise.reject(`${PROPOSER_MEMPOOL_ERROR} - ${url}/proposer/mempool`);
    }
  }

  /**
   * This function is calling proposer's fees endpoint and it returns ...
   * @param url - proposer's url
   */
  async getProposerFee(url: string): Promise<number> {
    try {
      const { data } = await this._httpService.axiosRef.get(`${url}/proposer/fee`);
      return data['fee'];
    } catch (_) {
      return Promise.reject(`${PROPOSER_FEES_ERROR} - ${url}/proposer/fee`);
    }
  }

  countChallengedBlocks(address: string): Promise<number> {
    return this._challengedBlockRepo.countChallengedBlocks({ [BlockSearchFields.PROPOSER]: address });
  }

  async queryProposer(address: string): Promise<ProposerDTO> {
    const proposer = await this._proposerRepo.findOne({ address });
    const result = mapToClass(proposer, ProposerDTO);

    return result;
  }

  logRejectedPromises(settledResults: PromiseSettledResult<number>[]): void {
    settledResults.forEach((result) => {
      if (result.status == 'rejected') {
        this.logger.error(result.reason);
      }
    });
  }

  async setNumberOfPendingTransactions(): Promise<void> {
    this.logger.log('Fetching proposer pending transactions');
    this.numberOfPendingTxs = await this.countPendingTransactions();
  }

  // Register cron job
  startCronJob() {
    const job = new CronJob(CronExpression.EVERY_MINUTE, this.setNumberOfPendingTransactions.bind(this));
    job.start();
  }
}
