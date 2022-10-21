import { Model, PaginateModel } from 'mongoose';
import { BlockDTO, ChallengedBlockDTO, ProposerDTO, TransactionDTO } from './dto';

export type QueryFilter = Record<string, any>;
export type OrQueryFilter = Record<'$or', QueryFilter[]>;

export type AnyResource = BlockDTO | TransactionDTO | ProposerDTO | ChallengedBlockDTO;

export type MongooseModel<T> = PaginateModel<T> & Model<T>;
export type BlockType = BlockDTO | ChallengedBlockDTO;
