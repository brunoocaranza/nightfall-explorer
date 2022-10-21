import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose } from 'class-transformer';
import { Document } from 'mongoose';
import { BaseSchema } from './base.schema';

@Schema({ versionKey: false })
export class TransactionEntity extends BaseSchema {
  @Expose()
  @Prop()
  transactionHash: string;

  @Expose()
  @Prop()
  transactionHashL1: string;

  @Expose()
  @Prop()
  transactionType: string;

  @Expose()
  @Prop()
  blockNumber: number;

  @Expose()
  @Prop()
  blockNumberL2: number;

  @Expose()
  @Prop()
  fee: number;

  @Expose()
  @Prop()
  mempool: boolean;

  @Expose()
  @Prop()
  nullifiers: string[];

  @Expose()
  @Prop()
  proof: string[];

  @Expose()
  @Prop()
  recipientAddress: string;

  @Expose()
  @Prop()
  tokenId: string;

  @Expose()
  @Prop()
  ercAddress: string;

  @Expose()
  @Prop()
  historicRootBlockNumberL2: string[];

  @Expose()
  @Prop()
  compressedSecrets: string[];

  @Expose()
  @Prop()
  value: string;

  @Expose()
  @Prop()
  timeBlockL2: Date;

  @Expose()
  @Prop()
  tokenType: string;
}

export type TransactionDocument = TransactionEntity & Document;
export const TransactionSchema = SchemaFactory.createForClass(TransactionEntity);
export const TransactionCollectionName = 'transactions';
