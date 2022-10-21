import { ApiProperty } from '@nestjs/swagger';
import { TimeUnit } from '../../utils';

export class AverageBlockCreationDTO {
  @ApiProperty({ enum: TimeUnit })
  timeUnit: TimeUnit | string;
  @ApiProperty()
  value: number | string;
}
