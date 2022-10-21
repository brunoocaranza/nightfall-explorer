import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { BlockDTO } from './block.dto';

export class ChallengedBlockDTO extends BlockDTO {
  @Expose()
  @ApiProperty()
  invalidCode: number;

  @Expose()
  @ApiProperty()
  invalidMessage: string;
}
