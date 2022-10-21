import { HttpStatus } from '@nestjs/common';
import { ErrorResponse } from '../../models';
import { BaseException } from './base.exception';

export class ForbiddenRequestException extends BaseException {
  private readonly _message: string;
  private readonly _exception: string;

  constructor() {
    super(HttpStatus.FORBIDDEN);
    this._message = `Invalid request`;
    this._exception = 'Forbidden';
  }

  getErrorResponse(): ErrorResponse {
    return {
      httpStatus: this._httpStatus,
      message: this._message,
      exception: this._exception,
    };
  }
}
