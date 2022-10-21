import { HttpStatus } from '@nestjs/common';
import { ErrorResponse } from '../../../models';

const handle404 = (message: string): ErrorResponse => {
  return { httpStatus: HttpStatus.NOT_FOUND, message };
};

const handleInternalServerError = (message: string): ErrorResponse => {
  return {
    httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
    exception: message,
    message: 'Unexpected error',
  };
};

export { handle404, handleInternalServerError };
