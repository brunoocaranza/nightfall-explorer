import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, TransformFnParams } from 'class-transformer';
import { HelperService, NOT_APPLICABLE } from '../../utils';

const convertStats = (params: TransformFnParams) => {
  const proposer = params.obj;
  const result = new ProposerStatsDTO();
  const goodBlocks = proposer.goodBlocks;
  const badBlocks = proposer.badBlocks;

  if (HelperService.typeOfNumber(badBlocks) && badBlocks >= 0) result.badBlocks = badBlocks;
  if (HelperService.typeOfNumber(goodBlocks) && goodBlocks >= 0) result.goodBlocks = goodBlocks;

  if (HelperService.isNumberType(result.goodBlocks)) {
    result.blocks = <number>result.goodBlocks;
  }
  if (HelperService.isNumberType(result.badBlocks)) {
    result.blocks += <number>result.badBlocks;
  }
  return result;
};
export class ProposerStatsDTO {
  @ApiProperty()
  blocks = 0;
  @ApiProperty()
  goodBlocks: number | string = 0;
  @ApiProperty()
  badBlocks: number | string = 0;
  @ApiProperty()
  challengedBlocks: number | string = NOT_APPLICABLE;
}

export class ProposerDTO {
  @Expose()
  @ApiProperty()
  url: string;
  @Expose()
  @ApiProperty()
  address: string;
  @ApiProperty()
  fee?: number | string = NOT_APPLICABLE;
  @Expose()
  @ApiProperty()
  isActive: boolean;
  @Expose()
  @Transform(convertStats)
  @ApiProperty({ type: ProposerStatsDTO })
  stats?: ProposerStatsDTO;
}

export class ProposerBuilder extends ProposerDTO {
  setStats(stats: ProposerStatsDTO) {
    this.stats = stats;
    return this;
  }

  setFee(promiseResult: PromiseSettledResult<number>) {
    if (promiseResult.status == 'fulfilled') {
      this.fee = promiseResult.value;
    }
    return this;
  }

  setChallengedBlocks(promiseResult: PromiseSettledResult<number>) {
    if (promiseResult.status == 'fulfilled') {
      this.stats.challengedBlocks = promiseResult.value;
    }
    return this;
  }
}
