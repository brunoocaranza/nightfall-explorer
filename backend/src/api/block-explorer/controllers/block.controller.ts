import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { IBlockService, IBlockCreationService } from '../services';
import {
  BlockDTO,
  BlockPagination,
  ChallengedBlockDTO,
  AverageBlockCreationDTO,
  ChallengedBlockStatsDTO,
  PaginationModel,
  BlockPaginationParams,
} from '../../../models';
import { BLOCK_CREATION_SERVICE, BLOCK_SERVICE } from '../../../utils';
import { IntegerPipe } from '../../../pipes';
import { BlockItemDTO } from '../../../models/dto/block-item.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('block')
@Controller('block')
export class BlockController {
  constructor(
    @Inject(BLOCK_SERVICE) private readonly _blockService: IBlockService,
    @Inject(BLOCK_CREATION_SERVICE) private readonly _blockCreationService: IBlockCreationService
  ) {}

  @Get('')
  @ApiResponse({ status: 200, type: BlockPagination })
  findPaginated(@Query() params: BlockPaginationParams): Promise<PaginationModel<BlockItemDTO>> {
    return this._blockService.findPaginated(params);
  }

  @Get('/:block_number')
  @ApiResponse({ status: 200, type: BlockDTO })
  findBlock(@Param('block_number', new IntegerPipe()) blockNumber: number): Promise<BlockDTO> {
    return this._blockService.findBlockByNumber(blockNumber);
  }

  @Get('/stats/count')
  @ApiResponse({ status: 200, type: Number })
  count(): Promise<number> {
    return this._blockService.count();
  }

  @Get('/stats/avg-creation')
  @ApiResponse({ status: 200, type: AverageBlockCreationDTO })
  averageBlockCreation(): Promise<AverageBlockCreationDTO | string> {
    return this._blockCreationService.findAverageBlockCreation();
  }

  @Get('/:block_number/challenged')
  @ApiResponse({ status: 200, type: ChallengedBlockDTO })
  findChallangedBlock(@Param('block_number', new IntegerPipe()) blockNumber: number): Promise<ChallengedBlockDTO> {
    return this._blockService.findChallangedBlockByNumber(blockNumber);
  }

  @Get('/challenged/stats')
  @ApiResponse({ status: 200, type: ChallengedBlockDTO })
  getChallengedBlockStats(): Promise<ChallengedBlockStatsDTO> {
    return this._blockService.getChallengedBlockStats();
  }
}
