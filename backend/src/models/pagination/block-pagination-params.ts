import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BadBlocks } from '../../utils';
import { PaginationParams } from './pagination-params';

export class BlockPaginationParams extends PaginationParams {
  @IsNotEmpty()
  @IsIn(['blockNumberL2', 'timeBlockL2'])
  @ApiProperty({ enum: ['blockNumberL2', 'timeBlockL2'] })
  sortColumn: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  proposer?: string;

  @IsOptional()
  @IsIn([BadBlocks.SHOW_BAD, BadBlocks.SHOW_GOOD])
  @ApiProperty({ required: false })
  badBlocks?: string;
}
