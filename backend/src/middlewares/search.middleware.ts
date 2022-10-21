import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { HelperService, SearchTerms } from '../utils';
import { BadRequestException } from '../utils/exceptions/bad-request.exception';

const extractQueryParam = (query: any, param: string): string => {
  const value = query[`${param}`];
  if (value) return value.toString().trim();
  return value;
};

@Injectable()
export class SearchMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Extract q query parameter for search
    const searchParam: string = extractQueryParam(req['query'], 'q');

    if (!searchParam) throw new BadRequestException();

    let searchTerm = '';

    // Determine what is search value. It can be Proposer Address, Hash (block or tx), Block number (both L1, L2)
    // In case that search value isn't in any of above formats error will be throwned
    if (HelperService.isProposerAddress(searchParam)) searchTerm = SearchTerms.BY_PROPOSER_ADDRESS;
    else if (HelperService.isNumber(searchParam)) searchTerm = SearchTerms.BY_BLOCK_NUMBER;
    else if (HelperService.isHash(searchParam)) searchTerm = SearchTerms.BY_HASH;
    else throw new BadRequestException();

    req.headers['searchTerm'] = searchTerm;
    next();
  }
}
