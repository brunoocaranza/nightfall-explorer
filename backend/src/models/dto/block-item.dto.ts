import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class BlockItemDTO {
  @Expose()
  @ApiProperty()
  blockNumberL2: number;

  @Expose()
  @ApiProperty()
  blockHash: string;

  @Expose()
  @ApiProperty()
  timeBlockL2: Date;

  @Transform((value) => value.obj.transactionHashes.length)
  @Expose()
  @ApiProperty()
  numberOfTransactions: number;

  @Expose()
  @ApiProperty()
  proposer: string;
}
