import { MongoClient } from 'mongodb';
import fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config();

const writeFileSync = (name, data) => {
  fs.writeFileSync(`../resources/${name}`, JSON.stringify(data), (err) => {
    if (err) process.exit(1);
  });
};

class DBClient {
  db;

  async connect() {
    try {
      const connection = new MongoClient(process.env.DB_CONNECTION);
      await connection.connect();

      this.db = connection.db(process.env.DB_NAME);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }

  async getAllProposerAddresses() {
    const collection = this.initCollection('proposers-scoreboard');
    const proposers = await collection.find().toArray();
    return proposers.map((proposer) => proposer.address);
  }

  async getBlocksData() {
    const collection = this.initCollection('blocks');
    // Get random documents
    const blocks = await collection.aggregate([{ $sample: { size: 20 } }]).toArray();
    return {
      numbersL2: blocks.map((block) => block.blockNumberL2),
      numbersL1: blocks.map((block) => block.blockNumber),
      blockHashes: blocks.map((block) => block.blockHash),
    };
  }

  async getTxData() {
    const collection = this.initCollection('transactions');
    // Get random documents
    const transactions = await collection.aggregate([{ $sample: { size: 20 } }]).toArray();
    return {
      transactionHashL2: transactions.map((tx) => tx.transactionHash),
      transactionHashL1: transactions.map((tx) => tx.transactionHashL1),
    };
  }

  async getBlocksCount() {
    const collection = this.initCollection('blocks');
    return collection.count();
  }

  initCollection(name) {
    return this.db.collection(name);
  }
}

async function main() {
  const dbClient = new DBClient();
  await dbClient.connect();

  const proposerAddresses = await dbClient.getAllProposerAddresses();
  writeFileSync('proposers.json', proposerAddresses);

  const { numbersL2, numbersL1, blockHashes } = await dbClient.getBlocksData();
  writeFileSync('numbersL2.json', numbersL2);
  writeFileSync('numbersL1.json', numbersL1);
  writeFileSync('blockHashes.json', blockHashes);

  const { transactionHashL2, transactionHashL1 } = await dbClient.getTxData();
  writeFileSync('transactionHashL2.json', transactionHashL2);
  writeFileSync('transactionHashL1.json', transactionHashL1);

  const count = await dbClient.getBlocksCount();
  writeFileSync('stats.json', { blockCount: count });

  console.log('##########################################');
  console.log('Test data exported to resources folder');
  console.log('##########################################\n');
  process.exit(1);
}

main();
