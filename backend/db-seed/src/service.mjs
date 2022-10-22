import { Proposer, Transaction } from './models/index.mjs';
import { randomNumBetween } from './helper.mjs';
import config from './config.mjs';

// ************** PROPOSER ***************
const generateProposers = (length) => Array.from({ length }, (_, ind) => new Proposer(++ind));

const getRandomProposerAddress = (proposers) => proposers[Math.floor(Math.random() * proposers.length)]._id;

const insertProposers = async (dbClient) => {
  const currentProposers = await dbClient.findAll(config.db.proposerCollection);

  const proposers = generateProposers(config.numOfProposers);

  await dbClient.bulkInsert(proposers, config.db.proposerCollection);
  proposers.push(...currentProposers);
  return proposers;
};

// ************** TX ***************
// There can be between 1 and 32 txs per block
const generateTxs = (blockNumber, blockNumberL2) =>
  Array.from({ length: randomNumBetween(1, 32) }, () => new Transaction(blockNumber, blockNumberL2));

const insertTxs = async (dbClient, blockNumber, blockNumberL2) => {
  const txs = generateTxs(blockNumber, blockNumberL2);
  await dbClient.bulkInsert(txs, config.db.transactionCollection);

  return txs.map((tx) => tx.transactionHash);
};

// ************** BLOCK ***************
const insertBlocks = async (blocks, dbClient) => {
  await dbClient.bulkInsert(blocks, config.db.blockCollection);
};

export { insertProposers, getRandomProposerAddress, insertTxs, insertBlocks };
