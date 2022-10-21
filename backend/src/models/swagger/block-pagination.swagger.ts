import { ApiProperty } from '@nestjs/swagger';
import { BlockItemDTO } from '../dto/block-item.dto';
import { PaginationModel } from '../pagination';

export class BlockPagination implements PaginationModel<BlockItemDTO> {
  @ApiProperty({ type: BlockItemDTO, isArray: true })
  docs: BlockItemDTO[];
  @ApiProperty()
  totalDocs: number;
  @ApiProperty()
  limit: number;
  @ApiProperty()
  hasPrevPage: boolean;
  @ApiProperty()
  hasNextPage: boolean;
  @ApiProperty()
  page?: number;
  @ApiProperty()
  totalPages: number;
  @ApiProperty()
  prevPage?: number;
  @ApiProperty()
  nextPage?: number;
  @ApiProperty()
  pagingCounter: number;
}
