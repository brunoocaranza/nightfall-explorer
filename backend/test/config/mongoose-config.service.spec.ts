import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { MongooseOptionsService } from '../../src/config/database';

describe('Mongoose Config Service', () => {
  let mongooseService: MongooseOptionsService;
  const mongooseOptions: MongooseModuleOptions = {
    uri: 'mongodb://localhost:27017/db',
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MongooseOptionsService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'database.name') {
                return 'db';
              } else if (key === 'database.host') {
                return 'localhost';
              } else if (key === 'database.port') {
                return 27017;
              } else if (key === 'database.username') {
                return '';
              } else if (key === 'database.password') {
                return '';
              }
              return null;
            }),
          },
        },
      ],
    }).compile();

    mongooseService = module.get<MongooseOptionsService>(MongooseOptionsService);
  });

  it('should call createMongooseOptions', () => {
    const spy = jest.spyOn(mongooseService, 'createMongooseOptions');

    mongooseService.createMongooseOptions();

    expect(spy).toHaveBeenCalled();
  });

  it('should should return MongooseModuleOptions', async () => {
    const result: MongooseModuleOptions = mongooseService.createMongooseOptions();
    expect(result).toMatchObject(mongooseOptions);
  });
});
