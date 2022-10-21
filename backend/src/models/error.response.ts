import { HttpStatus } from '@nestjs/common';
import { FieldException } from '../utils/exceptions/field.exception';

export class ErrorResponse {
  httpStatus: HttpStatus;
  message: string;
  exception?: string;
  fieldException?: FieldException[];
}
