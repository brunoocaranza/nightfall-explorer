import { Controller, Get, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { CONTRACT_CLIENT_SERVICE, HelperService } from '../../../utils';
import { IContractClientService } from '../services';

@ApiTags('contract')
@Controller('contracts')
export class ContractController {
  constructor(
    private readonly _config: ConfigService,
    @Inject(CONTRACT_CLIENT_SERVICE) private readonly _contractClient: IContractClientService
  ) {}

  @Get('')
  public getContractAddresses(): Promise<Record<string, string>[]> {
    return this.getAddresses();
  }

  private async getAddresses(): Promise<Record<string, string>[]> {
    const stateContract = this._config.get<string>('contract.stateContract');
    const shieldContract = this._config.get<string>('contract.shieldContract');

    const promises: Promise<string>[] = [];
    [stateContract, shieldContract].forEach((name) => {
      promises.push(this._contractClient.getContractAddress(name));
    });

    const [state, shield] = await Promise.allSettled(promises);
    const result: Record<string, string>[] = [];

    if (HelperService.isFullfiledPromise(state)) {
      result.push({
        [`${stateContract.toLowerCase()}`]: `${HelperService.getPromiseValue<string>(state)}`,
      });
    }

    if (HelperService.isFullfiledPromise(shield)) {
      result.push({
        [`${shieldContract.toLowerCase()}`]: `${HelperService.getPromiseValue<string>(shield)}`,
      });
    }

    return result;
  }
}
