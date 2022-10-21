import { Injectable, Logger } from '@nestjs/common';
import { AverageBlockCreationDTO } from '../../../../models';
import { IBlockCreationService } from '../iblock-creation.service';
import { BLOCK_CREATION, NOT_APPLICABLE } from '../../../../utils';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { EXPLORER_SYNC_URL_ERROR } from '../../../../utils/exceptions';

@Injectable()
export class BlockCreationService implements IBlockCreationService {
  private readonly logger = new Logger(BLOCK_CREATION);

  constructor(private readonly _http: HttpService, private readonly config: ConfigService) {}

  /**
   * Calls explorer-sync service to get average block time creation.
   * If endpoint is not reachable N/A value will be returned to client
   * @returns AverageBlockCreationDTO | NOT_APPLICABLE
   */
  async findAverageBlockCreation(): Promise<AverageBlockCreationDTO | string> {
    const url = `${this.config.get('explorerSyncUrl')}/block/avg-time`;
    try {
      const { data } = await this._http.axiosRef.get<AverageBlockCreationDTO>(url, { timeout: 5000 });
      return data;
    } catch (error) {
      this.logger.error(`${EXPLORER_SYNC_URL_ERROR} - ${url}`);
      return {
        value: NOT_APPLICABLE,
        timeUnit: '',
      };
    }
  }
}
