import { PipeTransform, Injectable } from '@nestjs/common';
import { HelperService } from '../utils';
import { HASH_FORMAT_ERROR } from '../utils/exceptions';
import { BadRequestException } from '../utils/exceptions/bad-request.exception';

@Injectable()
export class HashPipe implements PipeTransform {
  transform(value: any) {
    if (!HelperService.isHash(value)) throw new BadRequestException(HASH_FORMAT_ERROR);
    return value;
  }
}
