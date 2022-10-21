import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { PaginationParams } from './pagination-params';

export class ProposerPaginationParams extends PaginationParams {
  @IsNotEmpty()
  @IsIn(['goodBlocks', 'badBlocks'])
  @ApiProperty({ enum: ['goodBlocks', 'badBlocks'] })
  sortColumn: string;

  @IsOptional()
  @ApiProperty({ required: false })
  address?: string;
}
