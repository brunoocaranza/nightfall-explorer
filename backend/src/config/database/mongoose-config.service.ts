import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions, MongooseOptionsFactory } from '@nestjs/mongoose';

@Injectable()
class MongooseOptionsService implements MongooseOptionsFactory {
  readonly name: string;

  readonly host: string;

  readonly port: number;

  readonly username: string;

  readonly password: string;

  constructor(private readonly config: ConfigService) {
    this.name = this.config.get<string>('database.name');
    this.host = this.config.get<string>('database.host');
    this.port = this.config.get<number>('database.port');
    this.username = this.config.get<string>('database.username');
    this.password = this.config.get<string>('database.password');
  }

  createMongooseOptions(): MongooseModuleOptions {
    // docdb-tmp-stress12.cluster-cvcs3hq4x5r3.eu-central-1.docdb.amazonaws.com
    // docdb-tmp-stress1.cluster-cvcs3hq4x5r3.eu-central-1.docdb.amazonaws.com
    const uri = `mongodb://${this.host}:${this.port}/${this.name}`;

    const mongooseOptions: MongooseModuleOptions = {
      uri,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      replicaSet: 'rs0',
      readPreference: 'secondaryPreferred',
    };

    /* istanbul ignore next */
    if (this.username && this.password) {
      mongooseOptions.auth = {
        username: this.username,
        password: this.password,
      };
    }

    return mongooseOptions;
  }
}

export default MongooseOptionsService;
