import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, TransformFnParams } from 'class-transformer';
import { ProposerEntity } from '../../schemas';
import { NOT_APPLICABLE, PROPOSER_ITEM_TRANSFORM_CTX } from '../../utils';
import Web3 from 'web3';
import { Logger } from '@nestjs/common';
import { HEX_STRING_TO_NUMBER_CAST_ERROR } from '../../utils/exceptions';

// In case that conversion of hex number fails, print error and return N/A
const convertHexToString = (value: any) => {
  try {
    return Web3.utils.hexToNumberString(value);
  } catch (error) {
    new Logger(PROPOSER_ITEM_TRANSFORM_CTX).error(`${HEX_STRING_TO_NUMBER_CAST_ERROR}. Hex value: ${value}`);
    return NOT_APPLICABLE;
  }
};

const convertStakeAmount = (params: TransformFnParams) => {
  const proposer: ProposerEntity = params.obj;
  let result = NOT_APPLICABLE;

  if (proposer.stakeAccount && proposer.stakeAccount.amount) {
    const amount = proposer.stakeAccount.amount;

    if (typeof amount == 'object') {
      result = convertHexToString(amount._hex);
    } else {
      result = amount;
    }
  }

  return result;
};

const convertGoodBlocks = (params: TransformFnParams) => {
  const proposer = params.obj;
  let result = NOT_APPLICABLE;
  if (proposer.goodBlocks >= 0) result = proposer.goodBlocks;
  return result;
};

const convertBadBlocks = (params: TransformFnParams) => {
  const proposer = params.obj;
  let result = NOT_APPLICABLE;
  if (proposer.badBlocks >= 0) result = proposer.badBlocks;
  return result;
};

export class ProposerItemDTO {
  @Expose()
  @ApiProperty()
  address: string;
  @Expose()
  @Transform(convertGoodBlocks)
  @ApiProperty()
  goodBlocks: number;
  @Expose()
  @Transform(convertBadBlocks)
  @ApiProperty()
  badBlocks: number;
  @Expose()
  @Transform(convertStakeAmount)
  @ApiProperty()
  stakeAmount: string;
}
