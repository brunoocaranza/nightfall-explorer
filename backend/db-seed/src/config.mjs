import * as dotenv from 'dotenv';
dotenv.config();

export default {
  db: {
    dbName: process.env.DB_NAME,
    url: process.env.DB_CONNECTION,
    blockCollection: 'blocks',
    transactionCollection: 'transactions',
    proposerCollection: 'proposers-scoreboard',
  },
  minL1BlockNumber: 6541123,
  numOfProposers: 30,
  numOfBlocks: 1000000,
  chunkSize: 400,
  startingBlockNumber: 99999,
};
