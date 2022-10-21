import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose } from 'class-transformer';
import { Document } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { BaseSchema } from './base.schema';

@Schema({ timestamps: false, versionKey: false })
export class BlockEntity extends BaseSchema {
  @Expose()
  @Prop()
  blockHash: string;

  @Expose()
  @Prop()
  blockNumber: number;

  @Expose()
  @Prop()
  blockNumberL2: number;

  @Expose()
  @Prop()
  leafCount: number;

  @Expose()
  @Prop()
  nCommitments: number;

  @Expose()
  @Prop()
  previousBlockHash: string;

  @Expose()
  @Prop()
  proposer: string;

  @Expose()
  @Prop()
  root: string;

  @Prop()
  transactionHashL1: string;

  @Expose()
  @Prop({ type: [String] })
  transactionHashes: string[];

  @Expose()
  @Prop()
  transactionHashesRoot: string;

  @Expose()
  @Prop()
  timeBlockL2: Date;
}

export type BlockDocument = BlockEntity & Document;
export const BlockSchema = SchemaFactory.createForClass(BlockEntity);
BlockSchema.plugin(paginate);

export const BlockCollectionName = 'blocks';
