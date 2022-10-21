import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export class PaginationParams {
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  @Max(10)
  @Min(1)
  @ApiProperty()
  limit: number;

  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @ApiProperty()
  page: number;

  @IsNotEmpty()
  @IsIn(['desc', 'asc'])
  @ApiProperty({ enum: ['desc', 'asc'] })
  sortDirection: string;
}
