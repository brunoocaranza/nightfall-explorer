import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from '../../utils';
import MongooseOptionsService from './mongoose-config.service';

const mongooseModule = MongooseModule.forRootAsync({
  useClass: MongooseOptionsService,
  inject: [ConfigService],
  connectionName: DATABASE_CONNECTION_NAME,
});

@Module({
  imports: [mongooseModule],
  providers: [MongooseOptionsService],
  exports: [mongooseModule],
})
export class DatabaseModule {}
