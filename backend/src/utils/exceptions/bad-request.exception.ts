import { HttpStatus } from '@nestjs/common';
import { ErrorResponse } from '../../models';
import { BaseException } from './base.exception';
import { FieldException } from './field.exception';

export class BadRequestException extends BaseException {
  private readonly _message: string;
  private readonly _exception: string;
  private readonly _fieldException: FieldException[];

  constructor(exception = '', fieldException?: FieldException[]) {
    super(HttpStatus.BAD_REQUEST);
    this._message = `Invalid request`;
    this._exception = exception;
    this._fieldException = fieldException;
  }

  getErrorResponse(): ErrorResponse {
    return {
      httpStatus: this._httpStatus,
      message: this._message,
      exception: this._exception,
      fieldException: this._fieldException,
    };
  }
}
