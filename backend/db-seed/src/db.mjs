import { MongoClient } from "mongodb";
import config from "./config.mjs";

export class DBClient {
  db;

  async connect() {
    try {
      const connection = new MongoClient(config.db.url);
      await connection.connect();
      console.log("Successfully connected to database");

      this.db = connection.db(config.db.dbName);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }

  async clearCollection() {
    const collections = [
      config.db.blockCollection,
      config.db.proposerCollection,
      config.db.transactionCollection,
    ];
    console.log("\n********** Clearing collections **********");
    for (const collectionName of collections) {
      const collection = this.initCollection(collectionName);
      try {
        await collection.deleteMany({});
        console.log(`${collectionName} collection truncated`);
      } catch (error) {
        console.log(
          `This error occured probably because ${collectionName} doesn't exist`
        );
        console.log(error);
      }
    }

    console.log("****************************************");
  }

  async bulkInsert(entities, collectionName) {
    try {
      const collection = this.initCollection(collectionName);
      await collection.insertMany(entities);
    } catch (error) {
      console.log(`${collectionName}: bulk insert error`);
      console.log(error);
    }
  }

  initCollection(name) {
    return this.db.collection(name);
  }
}
