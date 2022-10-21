import { Injectable } from '@nestjs/common';
import { DatabaseEntity } from '../../config/database';
import { MongooseModel } from '../../models';
import { ProposerDocument, ProposerEntity } from '../../schemas';
import { Resources } from '../../utils';
import { IProposerRepository } from '../iproposer.repository';
import { BaseRepository } from './base.repository';

@Injectable()
export class ProposerRepository extends BaseRepository<ProposerDocument> implements IProposerRepository {
  constructor(@DatabaseEntity(ProposerEntity.name) private readonly _proposerModel: MongooseModel<ProposerDocument>) {
    super(_proposerModel, Resources.PROPOSER);
  }
}
