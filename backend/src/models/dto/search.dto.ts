import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, TransformFnParams } from 'class-transformer';

import { Resources } from '../../utils';
import { AnyResource } from '../types';
import { BlockDTO } from './block.dto';
import { ChallengedBlockDTO } from './challenged-block.dto';
import { ProposerDTO } from './proposer.dto';
import { TransactionDTO } from './transaction.dto';

const determineType = (params: TransformFnParams) => {
  const resource: AnyResource = params.obj;
  let result;
  if (resource instanceof ChallengedBlockDTO) result = Resources.CHALLENGED_BLOCK;
  else if (resource instanceof BlockDTO) result = Resources.BLOCK;
  else if (resource instanceof TransactionDTO) result = Resources.TRANSACTION;
  else if (resource instanceof ProposerDTO) result = Resources.PROPOSER;
  return result;
};

const determineValue = (params: TransformFnParams) => {
  const resource: AnyResource = params.obj;
  let result: string;
  if (resource instanceof BlockDTO || resource instanceof ChallengedBlockDTO)
    result = resource.blockNumberL2.toString();
  else if (resource instanceof TransactionDTO) result = resource.transactionHash;
  else if (resource instanceof ProposerDTO) result = resource.address;

  return result;
};

export class SearchResultDTO {
  @ApiProperty({ enum: Resources })
  @Expose()
  @Transform(determineType)
  type: Resources;
  @ApiProperty({ type: 'string' })
  @Expose()
  @Transform(determineValue)
  value: string;
}
