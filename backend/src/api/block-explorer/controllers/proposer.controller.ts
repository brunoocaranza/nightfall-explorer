import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  PaginationModel,
  ProposerPaginationParams,
  ProposerDTO,
  ProposerItemDTO,
  ProposerPagination,
} from '../../../models';
import { ProposerAddressPipe } from '../../../pipes';
import { PROPOSER_SERVICE } from '../../../utils';
import { IProposerService } from '../services';

@ApiTags('proposer')
@Controller('proposer')
export class ProposerController {
  constructor(@Inject(PROPOSER_SERVICE) private readonly _proposerService: IProposerService) {}

  @Get('/:address')
  @ApiResponse({ status: 200, type: ProposerDTO })
  findProposer(@Param('address', new ProposerAddressPipe()) address: string): Promise<ProposerDTO> {
    return this._proposerService.getProposerInfo(address);
  }

  @Get('')
  @ApiResponse({ status: 200, type: ProposerPagination })
  findPaginated(@Query() params: ProposerPaginationParams): Promise<PaginationModel<ProposerItemDTO>> {
    return this._proposerService.findPaginated(params);
  }

  @Get('/addresses/list')
  @ApiResponse({ status: 200, type: String, isArray: true })
  getProposerAddresses(): Promise<string[]> {
    return this._proposerService.getProposerAddresses();
  }
}
