import { DBClient } from './db.mjs';
import { insertProposers, insertTxs, insertBlocks, getRandomProposerAddress } from './service.mjs';
import config from './config.mjs';
import { Block } from './models/block.mjs';

const initDBConnection = async () => {
  const dbClient = new DBClient();
  await dbClient.connect();

  return dbClient;
};

const generateBlocksChunk = (
  dbClient,
  chunkSize,
  proposers,
  minL1BlockNumber,
  startingBlockNumber,
  previousBlockHash
) => {
  const blocks = [];

  const generateBlock = async (l1BlockNumber, blockNumber, previousBlockHash, proposer, previousTimeBlockL2) => {
    l1BlockNumber++;
    blockNumber++;
    const block = new Block(l1BlockNumber, blockNumber, previousBlockHash, proposer, previousTimeBlockL2);

    const txHashes = await insertTxs(dbClient, l1BlockNumber, blockNumber);
    block.transactionHashes = txHashes;
    blocks.push(block);
    chunkSize--;
    return chunkSize == 0
      ? blocks
      : generateBlock(
          block.blockNumber,
          block.blockNumberL2,
          block.blockHash,
          getRandomProposerAddress(proposers),
          block.timeBlockL2
        );
  };

  return generateBlock(
    minL1BlockNumber - 1,
    startingBlockNumber,
    previousBlockHash,
    getRandomProposerAddress(proposers),
    new Date()
  );
};
async function main() {
  // Connect to database
  const dbClient = await initDBConnection();

  // Coundn't drop collections because database will be removed, so that is why we are deleting all records
  // await dbClient.clearCollection();

  // Generate proposers
  const proposers = await insertProposers(dbClient);

  const chunkSize = +config.chunkSize;
  const numberOfLoops = +config.numOfBlocks / chunkSize;
  let minL1BlockNumber = config.minL1BlockNumber;
  let startingBlockNumber = config.startingBlockNumber;
  let previousBlockHash = '';

  console.log('\n\n********** Starting blocks creation **********');
  for (let i = 1; i <= numberOfLoops; i++) {
    console.log(`\nLoop: ${i} of ${numberOfLoops}`);

    const blocks = await generateBlocksChunk(
      dbClient,
      chunkSize,
      proposers,
      minL1BlockNumber,
      startingBlockNumber,
      previousBlockHash
    );

    previousBlockHash = blocks[blocks.length - 1].blockHash;
    startingBlockNumber += chunkSize;
    minL1BlockNumber += chunkSize;

    await insertBlocks(blocks, dbClient);
  }
}

main();
