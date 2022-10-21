import {
  BlockDTO,
  ProposerDTO,
  SearchResultDTO,
  TransactionDTO,
  TransactionItemDTO,
  BlockItemDTO,
  ChallengedBlockDTO,
  AverageBlockCreationDTO,
  PaginationModel,
  BlockPaginationParams,
  ProposerPaginationParams,
  ProposerItemDTO,
} from '../../src/models';
import { NOT_APPLICABLE, Resources, TimeUnit, TokenType, TransactionStatus, TransactionType } from '../../src/utils';

const transactionItems: TransactionItemDTO[] = [
  {
    transactionHash: '0x20b74ada0e98a4edfbce34022dc5a98c3f613a08607c48cf1565097128fe467a',
    transactionType: TransactionType.DEPOSIT,
  },
  {
    transactionHash: '0x10b74ada0e98a4edfbce34022dc5a98c3f613a08607c48cf1565097128fe467a',
    transactionType: TransactionType.TRANSFER,
  },
];

const block: BlockDTO = {
  blockHash: '0x10b74ada0e98a4edfbce34022dc5a98c3f613a08607c48cf1565097128fe467a',
  blockNumber: 3252,
  blockNumberL2: 531,
  leafCount: 0,
  nCommitments: 1,
  numberOfTransactions: 2,
  previousBlockHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
  proposer: '0xCaE0ed659d7821b59bBFd1b6B79260051e5E9111',
  root: '0x0d49d6a1a316313637547cae6491b9e87091b7c04694cdff350514a6a8257fe5',
  transactionHashesRoot: '0x293b2e98432714c5fe173ebbe91b596410d68f062fbb4cc460586214c42d046e',
  transactions: transactionItems,
  timeBlockL2: new Date(2022, 6, 5),
};

const sameL2L1BlockNumbers: BlockDTO[] = [
  {
    blockHash: '0x10b74ada0e98a4edfbce34022dc5a98c3f613a08607c48cf1565097128fe467a',
    blockNumber: 3252,
    blockNumberL2: 123,
    leafCount: 0,
    nCommitments: 1,
    numberOfTransactions: 2,
    previousBlockHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
    proposer: '0xCaE0ed659d7821b59bBFd1b6B79260051e5E9111',
    root: '0x0d49d6a1a316313637547cae6491b9e87091b7c04694cdff350514a6a8257fe5',
    transactionHashesRoot: '0x293b2e98432714c5fe173ebbe91b596410d68f062fbb4cc460586214c42d046e',
    transactions: transactionItems,
    timeBlockL2: new Date(2022, 6, 5),
    transactionHashes: [],
  },
  {
    blockHash: '0x10b74ada0e98a4edfbce34022dc5a98c3f613a08607c48cf1565097128fe467a',
    blockNumber: 123,
    blockNumberL2: 531,
    leafCount: 0,
    nCommitments: 1,
    numberOfTransactions: 2,
    previousBlockHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
    proposer: '0xCaE0ed659d7821b59bBFd1b6B79260051e5E9111',
    root: '0x0d49d6a1a316313637547cae6491b9e87091b7c04694cdff350514a6a8257fe5',
    transactionHashesRoot: '0x293b2e98432714c5fe173ebbe91b596410d68f062fbb4cc460586214c42d046e',
    transactions: transactionItems,
    timeBlockL2: new Date(2022, 6, 5),
    transactionHashes: [],
  },
];

const challengedBlock: ChallengedBlockDTO = {
  blockHash: '0x10b74ada0e98a4edfbce34022dc5a98c3f613a08607c48cf1565097128fe467a',
  blockNumber: 3252,
  blockNumberL2: 333,
  leafCount: 0,
  nCommitments: 1,
  numberOfTransactions: 2,
  previousBlockHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
  proposer: '0xCaE0ed659d7821b59bBFd1b6B79260051e5E9111',
  root: '0x0d49d6a1a316313637547cae6491b9e87091b7c04694cdff350514a6a8257fe5',
  transactionHashesRoot: '0x293b2e98432714c5fe173ebbe91b596410d68f062fbb4cc460586214c42d046e',
  transactions: transactionItems,
  invalidCode: 0,
  invalidMessage: 'Invalid message',
  timeBlockL2: new Date(),
};

const sameL2L1ChallangedBlocks: ChallengedBlockDTO[] = [
  {
    blockHash: '0x10b74ada0e98a4edfbce34022dc5a98c3f613a08607c48cf1565097128fe467a',
    blockNumber: 321,
    blockNumberL2: 333,
    leafCount: 0,
    nCommitments: 1,
    numberOfTransactions: 2,
    previousBlockHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
    proposer: '0xCaE0ed659d7821b59bBFd1b6B79260051e5E9111',
    root: '0x0d49d6a1a316313637547cae6491b9e87091b7c04694cdff350514a6a8257fe5',
    transactionHashesRoot: '0x293b2e98432714c5fe173ebbe91b596410d68f062fbb4cc460586214c42d046e',
    transactions: transactionItems,
    invalidCode: 0,
    invalidMessage: 'Invalid message',
    timeBlockL2: new Date(),
  },
  {
    blockHash: '0x10b74ada0e98a4edfbce34022dc5a98c3f613a08607c48cf1565097128fe467a',
    blockNumber: 3252,
    blockNumberL2: 321,
    leafCount: 0,
    nCommitments: 1,
    numberOfTransactions: 2,
    previousBlockHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
    proposer: '0xCaE0ed659d7821b59bBFd1b6B79260051e5E9111',
    root: '0x0d49d6a1a316313637547cae6491b9e87091b7c04694cdff350514a6a8257fe5',
    transactionHashesRoot: '0x293b2e98432714c5fe173ebbe91b596410d68f062fbb4cc460586214c42d046e',
    transactions: transactionItems,
    invalidCode: 0,
    invalidMessage: 'Invalid message',
    timeBlockL2: new Date(),
  },
];

const blockItems: BlockItemDTO[] = [
  {
    blockHash: '0x10b74ada0e98a4edfbce34022dc5a98c3f613a08607c48cf1565097128fe467a',
    blockNumberL2: 123,
    timeBlockL2: new Date(2022, 5, 5),
    numberOfTransactions: 2,
    proposer: '0xCaE0ed659d7821b59bBFd1b6B79260051e5E9111',
  },
  {
    blockHash: '0xcbdebbdd5b64ca93c6f030fd10e5da63e1855d945d905385f0ca3d4e6ffbf70b',
    blockNumberL2: 431,
    timeBlockL2: new Date(2022, 6, 5),
    numberOfTransactions: 3,
    proposer: '0x1230ed659d7821b59bBFd1b6B79260051e5E9111',
  },
];
const blockPaginated: PaginationModel<BlockItemDTO> = {
  docs: [...blockItems],
  totalDocs: 317,
  limit: 2,
  totalPages: 32,
  page: 1,
  pagingCounter: 3,
  hasPrevPage: false,
  hasNextPage: true,
  prevPage: 0,
  nextPage: 2,
};

const paginationParams: BlockPaginationParams = {
  page: 1,
  limit: 2,
  sortDirection: 'desc',
  sortColumn: 'timeBlockL2',
};

const proposerPaginationParams: ProposerPaginationParams = {
  page: 1,
  limit: 2,
  sortDirection: 'desc',
  sortColumn: 'goodBlocks',
};

const proposerItems = [
  {
    address: '0xCaE0ed659d7821b59bBFd1b6B79260051e5E9111',
    goodBlocks: 10,
    badBlocks: 5,
    stakeAmount: '123',
  },
  {
    address: '0xCaE0ed659d7821b59bBFd1b6B79260051e5E9111',
    goodBlocks: 343,
    badBlocks: 19,
    stakeAmount: '123',
  },
  {
    address: '0xCaE0ed659d7821b59bBFd1b6B79260051e5E9111',
    goodBlocks: 1,
    badBlocks: 1,
    stakeAmount: '123',
  },
  {
    address: '0xCaE0ed659d7821b59bBFd1b6B79260051e5E9111',
    goodBlocks: 343,
    badBlocks: 19,
    stakeAmount: '123',
  },
  {
    address: '0xCaE0ed659d7821b59bBFd1b6B79260051e5E9111',
    goodBlocks: 1,
    badBlocks: 1,
    stakeAmount: '123',
  },
];

const proposerPaginated: PaginationModel<ProposerItemDTO> = {
  docs: [...proposerItems],
  totalDocs: proposerItems.length,
  limit: 2,
  totalPages: 3,
  page: 1,
  pagingCounter: 3,
  hasPrevPage: false,
  hasNextPage: true,
  prevPage: null,
  nextPage: 2,
};

const transaction = new TransactionDTO();
transaction.transactionHash = '0x20b74ada0e98a4edfbce34022dc5a98c3f613a08607c48cf1565097128fe467a';
transaction.transactionHashL1 = '0x20b74ada0e98a4edfbce34022dc5a98c3f613a08607c48cf1565097128fe467a';
transaction.blockNumberL2 = 321;
transaction.compressedSecrets = [
  '0x0000000000000000000000000000000000000000000000000000000000000000',
  '0x0000000000000000000000000000000000000000000000000000000000000000',
];
transaction.ercAddress = '0x000000000000000000000000a8473bef03cbe50229a39718cbdc1fdee2f26b1a';
transaction.fee = 0;
transaction.historicRootBlockNumberL2 = ['0', '0'];
transaction.mempool = false;
transaction.nullifiers = [
  '0x0000000000000000000000000000000000000000000000000000000000000000',
  '0x0000000000000000000000000000000000000000000000000000000000000000',
];
transaction.proof = [
  '0x035da2f84eaeca497fa818cc497b84a1d601e88fc41e9a2ef7f9bdb13dcd30a0',
  '0x03aa948cab95c4cf7a72df429791152a3c25039a4ef96bbf2d14765b61e785dc',
  '0x270bce97bd26808fd948fe0ffcb70d224deff9e95ff048c6dabd18339bc24d69',
  '0x2c7c5d4bacb8b48ef80a266d939b2ec4775c80b3f7216d61cb0504c00d2e5cbf',
  '0x1905c47d0ce96ce8e55b5759688cc88b94f6ab5c4587f232cbe7efb12d1f138e',
  '0x10b65d699df0441d3cb9efe38535b0b7ea41a5b4ac18f39abf8228043744793f',
  '0x2528c7fb7d4aadc4397195fc40cfb000633920808f6897c0bef29f00254e5453',
  '0x15c73c0f183266818e277be9ffe9f8c975579700e3ead94cb8dca2fbc9bb450d',
];
transaction.tokenId = '0x0000000000000000000000000000000000000000000000000000000000000000';
transaction.tokenType = TokenType.ERC_20;
transaction.amount = 1;
transaction.timeBlockL2 = new Date(2022, 5, 5);
transaction.transactionType = TransactionType.DEPOSIT;
transaction.status = TransactionStatus.AVAILABLE;
transaction.tokenType = TokenType.ERC_20;
transaction.hasEthScanLink = true;
transaction.blockNumber = 765;

const proposer: ProposerDTO = {
  url: 'https://proposer.testnet.polygon-nightfall.technology',
  address: '0xCaE0ed659d7821b59bBFd1b6B79260051e5E9111',
  isActive: true,
  stats: {
    goodBlocks: 0,
    badBlocks: 0,
    blocks: 0,
    challengedBlocks: NOT_APPLICABLE,
  },
};

const searchResultBlock: SearchResultDTO = {
  type: Resources.BLOCK,
  value: block.blockNumberL2.toString(),
};

const averageBlockCreation: AverageBlockCreationDTO = {
  timeUnit: TimeUnit.HOUR,
  value: 5,
};

export {
  block,
  transaction,
  proposer,
  searchResultBlock,
  blockPaginated,
  paginationParams,
  challengedBlock,
  averageBlockCreation,
  proposerPaginationParams,
  proposerPaginated,
  proposerItems,
  sameL2L1BlockNumbers,
  sameL2L1ChallangedBlocks,
};
