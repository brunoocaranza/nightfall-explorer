import { CacheModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  BlockRepository,
  ChallengedBlockRepository,
  ProposerRepository,
  TransactionRepository,
} from '../../repositories';
import {
  BlockCollectionName,
  BlockEntity,
  BlockSchema,
  ChallengedBlockCollectionName,
  ChallengedBlockEntity,
  ChallengedBlockSchema,
  ProposerCollectionName,
  ProposerEntity,
  ProposerSchema,
  TransactionCollectionName,
  TransactionEntity,
  TransactionSchema,
} from '../../schemas';
import {
  BLOCK_REPOSITORY,
  BLOCK_SERVICE,
  TRANSACTION_REPOSITORY,
  TRANSACTION_SERVICE,
  DATABASE_CONNECTION_NAME,
  SEARCH_SERVICE,
  PROPOSER_SERVICE,
  CHALLENGED_BLOCK_REPOSITORY,
  BLOCK_CREATION_SERVICE,
  CONTRACT_CLIENT_SERVICE,
  PROPOSER_REPOSITORY,
} from '../../utils/constants';
import {
  BlockCreationService,
  BlockService,
  SearchService,
  ContractClientService,
  TransactionService,
} from './services';
import {
  BlockController,
  ContractController,
  NetworkController,
  ProposerController,
  SearchController,
  TransactionController,
} from './controllers';
import { ProposerService } from './services/impl/proposer.service';
import { HttpModule } from '@nestjs/axios';

const SERVICES = [
  {
    provide: BLOCK_REPOSITORY,
    useClass: BlockRepository,
  },
  {
    provide: BLOCK_SERVICE,
    useClass: BlockService,
  },
  {
    provide: TRANSACTION_REPOSITORY,
    useClass: TransactionRepository,
  },
  {
    provide: TRANSACTION_SERVICE,
    useClass: TransactionService,
  },
  {
    provide: SEARCH_SERVICE,
    useClass: SearchService,
  },
  {
    provide: PROPOSER_SERVICE,
    useClass: ProposerService,
  },
  {
    provide: CHALLENGED_BLOCK_REPOSITORY,
    useClass: ChallengedBlockRepository,
  },
  {
    provide: BLOCK_CREATION_SERVICE,
    useClass: BlockCreationService,
  },
  {
    provide: CONTRACT_CLIENT_SERVICE,
    useClass: ContractClientService,
  },
  {
    provide: PROPOSER_REPOSITORY,
    useClass: ProposerRepository,
  },
];

const CONTROLLERS = [
  BlockController,
  TransactionController,
  SearchController,
  ProposerController,
  NetworkController,
  ContractController,
];

const mongooseModule = MongooseModule.forFeature(
  [
    {
      name: BlockEntity.name,
      schema: BlockSchema,
      collection: BlockCollectionName,
    },
    {
      name: TransactionEntity.name,
      schema: TransactionSchema,
      collection: TransactionCollectionName,
    },
    {
      name: ChallengedBlockEntity.name,
      schema: ChallengedBlockSchema,
      collection: ChallengedBlockCollectionName,
    },
    {
      name: ProposerEntity.name,
      schema: ProposerSchema,
      collection: ProposerCollectionName,
    },
  ],
  DATABASE_CONNECTION_NAME
);

const IMPORTS = [mongooseModule, HttpModule];

@Module({
  imports: [...IMPORTS, CacheModule.register()],
  providers: [...SERVICES],
  controllers: [...CONTROLLERS],
  exports: [...SERVICES],
})
export class BlockExplorerModule {}
