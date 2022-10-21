import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { TransactionType } from '../../utils';

export class TransactionItemDTO {
  @Expose()
  @ApiProperty()
  transactionHash: string;

  @Expose()
  @ApiProperty({ enum: TransactionType })
  transactionType: TransactionType;
}
