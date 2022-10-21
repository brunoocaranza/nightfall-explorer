export * from './dto.mock';
export * from './entity.mock';
export * from './contract-abi.mock';
export const hash = '0x10b74ada0e98a4edfbce34022dc5a98c3f613a08607c48cf1565097128fe467a';
export const proposerAddress = '0xCaE0ed659d7821b59bBFd1b6B79260051e5E9111';
export const proposerUrl = 'https://proposer.com';

import { LoggerService } from '@nestjs/common';

export class TestLogger implements LoggerService {
  log(message: string): any {
    return;
  }
  error(message: string): any {
    return;
  }
  warn(message: string): any {
    return;
  }
  debug(message: string): any {
    return;
  }
  verbose(message: string): any {
    return;
  }
}
