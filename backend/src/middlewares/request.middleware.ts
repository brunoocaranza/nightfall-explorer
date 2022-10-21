import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { CORRELATION_ID, HTTP } from '../utils/constants';

@Injectable()
export class RequestMiddleware implements NestMiddleware {
  private readonly logger = new Logger(HTTP);
  use(req: Request, res: Response, next: NextFunction) {
    const correlationId = uuidv4();
    req.headers[`${CORRELATION_ID}`] = correlationId;
    this.logger.log(JSON.stringify({ route: req.url, method: req.method, correlationId }, null, 4));
    next();
  }
}
