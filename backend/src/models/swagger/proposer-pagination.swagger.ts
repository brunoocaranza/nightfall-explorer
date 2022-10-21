import { ApiProperty } from '@nestjs/swagger';
import { ProposerItemDTO } from '../dto';
import { PaginationModel } from '../pagination';

export class ProposerPagination implements PaginationModel<ProposerItemDTO> {
  @ApiProperty({ type: ProposerItemDTO, isArray: true })
  docs: ProposerItemDTO[];
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
