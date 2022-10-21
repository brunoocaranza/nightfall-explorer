import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { TransactionItemDTO } from './transaction-item.dto';

export class BlockDTO {
  @Expose()
  @ApiProperty()
  blockHash: string;

  @Expose()
  @ApiProperty()
  blockNumber: number;

  @Expose()
  @ApiProperty()
  blockNumberL2: number;

  @Transform((value) => value.obj.transactionHashes.length)
  @Expose()
  @ApiProperty()
  numberOfTransactions: number;

  @Expose()
  @ApiProperty()
  proposer: string;

  @Expose()
  @ApiProperty()
  leafCount: number;

  @Expose()
  @ApiProperty()
  nCommitments: number;

  @Expose()
  @ApiProperty()
  previousBlockHash: string;

  @Expose()
  @ApiProperty()
  root: string;

  @Expose()
  @ApiProperty()
  transactionHashesRoot: string;

  @Expose()
  transactionHashes?: string[];

  @ApiProperty({ type: TransactionItemDTO, isArray: true })
  transactions: TransactionItemDTO[];

  @Expose()
  @ApiProperty()
  timeBlockL2: Date;
}
