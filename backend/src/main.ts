import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { IInitService } from './api/block-explorer/services';
import { AppModule } from './app.module';
import { configureApp } from './config/configure-app.config';
import { CONTRACT_CLIENT_SERVICE, PROPOSER_SERVICE } from './utils';
import { Logger } from './config/logger/logger.service';

/*
 * Initialize classes on application startup. Update array of instances but be aware of order
 */
const onBootInit = async (app: INestApplication) => {
  console.log('###################################### Class initialization ######################################');
  for (const className of [CONTRACT_CLIENT_SERVICE, PROPOSER_SERVICE]) {
    const instance: IInitService = app.get(className);
    await instance.init();
  }
  console.log('#################################################################################################\n');
};

const startupVariables = (app: INestApplication) => {
  const configService: ConfigService = app.get(ConfigService);
  const serverPort = configService.get<number>('app.port');
  const serviceName = configService.get<string>('app.serviceName');
  const host = configService.get<string>('app.host');

  return { serverPort, serviceName, host, configService };
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const { serverPort, serviceName, host, configService } = startupVariables(app);

  // Overriding nest logger with custom winston logger
  app.useLogger(new Logger(configService));

  await onBootInit(app);

  configureApp(app);

  await app.listen(serverPort);

  console.log(`${serviceName} is running on ${host}:${serverPort}`);
}

bootstrap();
