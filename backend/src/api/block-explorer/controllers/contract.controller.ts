import { Controller, Get, Inject } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CONTRACT_CLIENT_SERVICE } from '../../../utils';
import { IContractClientService } from '../services';

@ApiTags('contract')
@Controller('contracts')
export class ContractController {
  constructor(@Inject(CONTRACT_CLIENT_SERVICE) private readonly _contractClient: IContractClientService) {}

  @Get('')
  public getContractAddresses(): Record<string, string>[] {
    return this._contractClient.getContractAddresses();
  }
}
