import { generateHash, randomNumBetween, addRandomNumberOfHours } from '../helper.mjs';

export class Block {
  _id;
  blockHash;
  blockNumber;
  blockNumberL2;
  leafCount;
  nCommitments;
  previousBlockHash;
  proposer;
  root;
  timeBlockL2;
  transactionHashL1;
  transactionHashes;
  transactionHashesRoot;

  constructor(blockNumber, blockNumberL2, previousBlockHash, proposer, previousTimeBlockL2) {
    this.blockNumber = blockNumber;
    this.blockNumberL2 = blockNumberL2;
    this.proposer = proposer;

    if (blockNumberL2 === 0)
      this.previousBlockHash = '0x0000000000000000000000000000000000000000000000000000000000000000';
    else this.previousBlockHash = previousBlockHash;

    const hash = generateHash();
    this._id = hash;
    this.blockHash = hash;
    this.leafCount = randomNumBetween(0, 2);
    this.nCommitments = randomNumBetween(1, 2);
    this.timeBlockL2 = addRandomNumberOfHours(previousTimeBlockL2);
    this.transactionHashL1 = generateHash();
    this.transactionHashesRoot = generateHash();
    this.root = generateHash();
  }
}
