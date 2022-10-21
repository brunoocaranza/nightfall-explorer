import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { ErrorResponse } from '../../../models';
import { CORRELATION_ID, EXCEPTION_HANDLER } from '../../constants';
import { BadRequestException } from '../bad-request.exception';
import { ForbiddenRequestException } from '../forbidden.exception';
import { RateLimitException } from '../rate-limit.exception';
import { ResourceNotFoundException } from '../resource-not-found.exception';
import { handle404, handleInternalServerError } from './exception.utils';

@Catch(HttpException)
export class ExceptionHandler implements ExceptionFilter {
  private readonly logger = new Logger(EXCEPTION_HANDLER);
  async catch(exception: HttpException, host: ArgumentsHost): Promise<void> {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response = ctx.getResponse();
    const correlationid = ctx.getRequest().headers[`${CORRELATION_ID}`];
    let errorResponse: ErrorResponse;

    if (exception instanceof ResourceNotFoundException) {
      errorResponse = exception.getErrorResponse();
    } else if (exception instanceof BadRequestException) {
      errorResponse = exception.getErrorResponse();
    } else if (exception instanceof ForbiddenRequestException) {
      errorResponse = exception.getErrorResponse();
    } else if (exception instanceof RateLimitException) {
      errorResponse = new RateLimitException().getErrorResponse();
    } else if (exception.getStatus() === HttpStatus.NOT_FOUND) {
      errorResponse = handle404(exception.message);
    } else {
      errorResponse = handleInternalServerError(exception.message);
    }

    const log: Record<string, any> = {
      correlationid,
      errorResponse,
    };

    if (HttpStatus.INTERNAL_SERVER_ERROR === errorResponse.httpStatus) {
      log.stack = exception.stack;
    }

    this.logger.error(JSON.stringify(log, null, 4));

    response.status(errorResponse.httpStatus).json(errorResponse);
  }
}
