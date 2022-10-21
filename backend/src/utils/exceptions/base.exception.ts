import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorResponse } from '../../models/error.response';

export abstract class BaseException extends HttpException {
  _httpStatus: HttpStatus;

  protected constructor(httpStatus: HttpStatus) {
    super('', httpStatus);
    this._httpStatus = httpStatus;
  }

  abstract getErrorResponse(): ErrorResponse;
}
