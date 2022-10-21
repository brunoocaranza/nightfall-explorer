import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose } from 'class-transformer';
import { Document } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
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
ChallengedBlockSchema.plugin(paginate);

export const ChallengedBlockCollectionName = 'invalid_blocks';
