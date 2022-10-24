import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose } from 'class-transformer';
import { Document } from 'mongoose';
import { BlockEntity } from './block.schema';

@Schema({ timestamps: false, versionKey: false })
export class ChallengedBlockEntity extends BlockEntity {
  @Expose()
  @Prop()
  invalidCode: number;

  @Expose()
  @Prop()
  invalidMessage: string;
}

export type ChallengedBlockDocument = ChallengedBlockEntity & Document;
export const ChallengedBlockSchema = SchemaFactory.createForClass(ChallengedBlockEntity);

export const ChallengedBlockCollectionName = 'invalid_blocks';
