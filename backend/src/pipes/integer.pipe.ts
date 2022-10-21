import { PipeTransform, Injectable } from '@nestjs/common';
import { HelperService } from '../utils';
import { CAST_TO_NUMBER_ERROR } from '../utils/exceptions';
import { BadRequestException } from '../utils/exceptions/bad-request.exception';

@Injectable()
export class IntegerPipe implements PipeTransform {
  transform(value: any) {
    if (!HelperService.isNumber(value)) throw new BadRequestException(CAST_TO_NUMBER_ERROR);
    return value;
  }
}
