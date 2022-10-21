import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import WinstonCloudwatch, { LogObject } from 'winston-cloudwatch';
import { v4 as uuidv4 } from 'uuid';

enum LogLevels {
  INFO = 'info',
  DEBUG = 'debug',
  WARN = 'warn',
  ERROR = 'error',
  VERBOSE = 'verbose',
}

const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.colorize({
      colors: {
        info: 'cyan',
        debug: 'blue',
        error: 'red',
        warn: 'yellow',
      },
    }),
    winston.format.printf((info) => {
      return `${info.timestamp} [${info.level}] [${info.context}] ${info.message}`;
    })
  ),
});

const cloudWatchTransport = (env: string, configService: ConfigService) => {
  return new WinstonCloudwatch({
    name: `Nighfall explorer logs - ${env}`,
    logGroupName: `${configService.get('cloudWatch.groupName')}`,
    logStreamName: `${uuidv4()}`,
    messageFormatter: (item: LogObject) => {
      return ` [${item.level}]:  [${item.context}] ${item.message}`;
    },
    errorHandler: (err) => {
      console.error('Cloud watch error: ', err);
    },
  });
};

@Injectable()
export class Logger implements LoggerService {
  private logger: winston.Logger;

  constructor(configService: ConfigService) {
    const env = configService.get('app.env');
    const level = env === 'dev' ? LogLevels.DEBUG : LogLevels.INFO;

    this.logger = winston.createLogger({
      levels: winston.config.npm.levels,
      level,
    });

    if (env !== 'local') {
      this.logger.add(cloudWatchTransport(env, configService));
    } else this.logger.add(consoleTransport);
  }

  log(message: any, context: string): void {
    this.logger.log(LogLevels.INFO, { message, context });
  }
  error(message: any, context: string): void {
    this.logger.error(LogLevels.ERROR, { message, context });
  }
  warn(message: any, context: string) {
    this.logger.warn(LogLevels.WARN, { message, context });
  }
  debug(message: any, context: string) {
    this.logger.debug(LogLevels.DEBUG, { message, context });
  }
  verbose(message: any, context: string) {
    this.logger.verbose(LogLevels.VERBOSE, { message, context });
  }
}
