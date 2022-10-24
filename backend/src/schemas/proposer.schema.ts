import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose } from 'class-transformer';
import mongoose, { Document } from 'mongoose';
import { BaseSchema } from './base.schema';

type BigNumber = {
  _hex: string;
  _isBigNumber: boolean;
};

export class StakeAccount {
  @Prop({ type: mongoose.Schema.Types.Mixed })
  amount: string | BigNumber;
  @Prop()
  challengeLocked: string;
  @Prop()
  time: string;
}

@Schema({ timestamps: true, versionKey: false })
export class ProposerEntity extends BaseSchema {
  @Expose()
  @Prop()
  url: string;

  @Expose()
  @Prop()
  address: string;

  @Expose()
  @Prop()
  isActive: boolean;

  @Expose()
  @Prop()
  goodBlocks: number;

  @Expose()
  @Prop()
  badBlocks: number;

  @Expose()
  @Prop({ type: StakeAccount })
  stakeAccount: StakeAccount;
}

export type ProposerDocument = ProposerEntity & Document;
export const ProposerSchema = SchemaFactory.createForClass(ProposerEntity);

export const ProposerCollectionName = 'proposers-scoreboard';
