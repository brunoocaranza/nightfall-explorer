import { ApiProperty } from '@nestjs/swagger';
import { NOT_APPLICABLE } from '../../utils';

export class ChallengedBlockStatsDTO {
  @ApiProperty()
  blockPercentage: number | string = NOT_APPLICABLE;
  @ApiProperty()
  blocksCount: number | string = NOT_APPLICABLE;
}
