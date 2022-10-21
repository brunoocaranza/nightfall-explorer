import { Prop } from '@nestjs/mongoose';
import { Expose } from 'class-transformer';

export abstract class BaseSchema {
  @Expose()
  @Prop({ type: String })
  _id: string;
}
