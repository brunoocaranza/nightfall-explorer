import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, TransformFnParams } from 'class-transformer';
import { HelperService, OFF_CHAIN, TokenType, TransactionStatus, TransactionType } from '../../utils';

export const determineTxType = (params: TransformFnParams) => {
  const type = params.obj['transactionType'];
  const typeNumber = Number(type);
  let result;
  if (typeNumber === 0) result = TransactionType.DEPOSIT;
  else if (typeNumber === 1) result = TransactionType.TRANSFER;
  else result = TransactionType.WITHDRAW;

  return result;
};

const determineTokenType = (params: TransformFnParams) => {
  const type = params.obj['tokenType'];
  const typeNumber = Number(type);
  let result;
  if (typeNumber === 0) result = TokenType.ERC_20;
  else if (typeNumber === 1) result = TokenType.ERC_721;
  else result = TokenType.ERC_1155;

  return result;
};

const determineEthScanLink = (params: TransformFnParams) => {
  const { transactionHashL1, blockNumber } = params.obj;
  let result = true;

  if ([transactionHashL1, blockNumber].some((el) => el === OFF_CHAIN)) result = false;

  return result;
};
export class TransactionDTO {
  @Expose()
  @ApiProperty()
  transactionHash: string;

  @Expose()
  @ApiProperty()
  transactionHashL1: string;

  @Expose()
  @Transform(determineTxType)
  @ApiProperty({ enum: TransactionType })
  transactionType: TransactionType;

  @Expose()
  @ApiProperty()
  blockNumber: number;

  @Expose()
  @ApiProperty()
  blockNumberL2: number;

  @Expose()
  @ApiProperty()
  fee: number;

  @Expose()
  @ApiProperty()
  mempool: boolean;

  @Expose()
  @ApiProperty()
  nullifiers: string[];

  @Expose()
  @ApiProperty()
  proof: string[];

  @Expose()
  @ApiProperty({ required: false })
  recipientAddress: string;

  @Expose()
  @ApiProperty()
  tokenId: string;

  @Expose()
  @ApiProperty()
  ercAddress: string;

  @Expose()
  @ApiProperty()
  historicRootBlockNumberL2: string[];

  @Expose()
  @ApiProperty()
  compressedSecrets: string[];

  @Expose({ name: 'value' })
  @Transform((params) => {
    return Number(params.obj['value']);
  })
  @ApiProperty()
  amount: number;

  @Expose()
  @ApiProperty()
  timeBlockL2: Date;

  @Expose()
  @Transform(determineTokenType)
  @ApiProperty({ enum: TokenType })
  tokenType: TokenType;

  @Expose()
  @ApiProperty({ enum: TransactionStatus })
  status: TransactionStatus | null;

  @Expose()
  @Transform(determineEthScanLink)
  @ApiProperty()
  hasEthScanLink: boolean;

  isWithdrawTx = (): boolean => {
    return this.transactionType === TransactionType.WITHDRAW;
  };

  /**
   * If recipient address contains only 0 in address then this property shouldn't be displayed on frontend.
   * Number(recipientAddress) will transform string to number. In case string has 0x0000 conversion will return 0
   */
  invalidRecipientAddress(): boolean {
    return Number(this.recipientAddress) === 0;
  }

  /**
   * Checking transaction status which depends on Transation Type and timeBlockL2 timestamp
   */
  setTxStatus(): void {
    if (this.isWithdrawTx()) {
      this.status = TransactionStatus.PENDING;
      if (HelperService.weekOlderOrEqualDate(this.timeBlockL2)) this.status = TransactionStatus.AVAILABLE;
    } else this.status = null;
  }
}
