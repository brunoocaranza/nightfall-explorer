import { HttpStatus } from '@nestjs/common';
import { ErrorResponse } from '../../models';
import { BaseException } from './base.exception';

export class RateLimitException extends BaseException {
  private readonly _message: string;

  constructor() {
    super(HttpStatus.TOO_MANY_REQUESTS);
    this._message = `Too many requests`;
  }

  getErrorResponse(): ErrorResponse {
    return {
      httpStatus: this._httpStatus,
      message: this._message,
    };
  }
}
