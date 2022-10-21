import { PipeTransform, Injectable } from '@nestjs/common';
import { HelperService } from '../utils';
import { ADDRESS_FORMAT_ERROR } from '../utils/exceptions';
import { BadRequestException } from '../utils/exceptions/bad-request.exception';

@Injectable()
export class ProposerAddressPipe implements PipeTransform {
  transform(value: any) {
    if (!HelperService.isProposerAddress(value)) throw new BadRequestException(ADDRESS_FORMAT_ERROR);
    return value;
  }
}
