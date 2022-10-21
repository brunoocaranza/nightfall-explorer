import { HttpStatus } from '@nestjs/common';
import { ErrorResponse } from '../../models';
import { BaseException } from './base.exception';

export class ResourceNotFoundException extends BaseException {
  private readonly _message: string;

  constructor(resource = '') {
    super(HttpStatus.NOT_FOUND);
    this._message = `Resource ${resource} not found`;
  }

  getErrorResponse(): ErrorResponse {
    return {
      httpStatus: this._httpStatus,
      message: this._message,
      exception: '',
    };
  }
}
