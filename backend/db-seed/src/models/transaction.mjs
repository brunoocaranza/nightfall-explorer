import { generateHash, randomNumBetween, generateHashesTimes, tenPercenteChance } from '../helper.mjs';

export class Transaction {
  _id;
  transactionHash;
  blockNumber;
  blockNumberL2;
  commitmentFee;
  commitments;
  compressedSecrets;
  ercAddress;
  fee;
  historicRootBlockNumberL2;
  historicRootBlockNumberL2Fee;
  mempool;
  nullifiers;
  nullifiersFee;
  proof;
  recipientAddress;
  tokenId;
  tokenType;
  transactionHashL1;
  transactionType;
  value;
  timeBlockL2;

  constructor(blockNumber, blockNumberL2) {
    this.blockNumber = blockNumber;
    this.blockNumberL2 = blockNumberL2;
    const hash = generateHash();
    const isOffChain = tenPercenteChance();

    if (isOffChain) {
      this.blockNumber = 'offchain';
    }
    this._id = hash;
    this.transactionHash = hash;
    this.commitmentFee = ['0x0000000000000000000000000000000000000000000000000000000000000000'];
    this.commitments = generateHashesTimes(2);
    this.compressedSecrets = ['0x0000000000000000000000000000000000000000000000000000000000000000', generateHash()];
    this.ercAddress = generateHash();
    this.fee = randomNumBetween(0, 5).toString();
    this.historicRootBlockNumberL2 = [randomNumBetween(0, 2).toString(), randomNumBetween(0, 3).toString()];
    this.historicRootBlockNumberL2Fee = [randomNumBetween(0, 5).toString(), randomNumBetween(0, 5).toString()];
    this.mempool = false;
    this.nullifiers = ['0x0000000000000000000000000000000000000000000000000000000000000000'];
    this.nullifiersFee = ['0x0000000000000000000000000000000000000000000000000000000000000000'];
    this.proof = generateHashesTimes(5);
    this.recipientAddress = '0x0000000000000000000000000000000000000000000000000000000000000000';
    this.tokenId = '0x0000000000000000000000000000000000000000000000000000000000000000';
    this.tokenType = this.getTokenType();
    this.transactionType = this.getTransactionType();
    this.transactionHashL1 = isOffChain ? 'offchain' : generateHash();
    this.value = '10000';
    this.timeBlockL2 = new Date();
  }

  getTokenType() {
    const tokens = ['0', '1', '2'];
    return tokens[randomNumBetween(0, 2)];
  }

  getTransactionType() {
    const types = ['0', '1', '2'];
    return types[randomNumBetween(0, 2)];
  }
}
