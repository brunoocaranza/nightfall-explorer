import { MongoClient } from "mongodb";
import { database } from "./constants.mjs";
import logger from "./logger.mjs";

async function connection() {
  try {
    let connectionString = "";
    if (database.user && database.password) {
      connectionString = `mongodb://${database.user}:${database.password}@${database.url}`;
    } else {
      connectionString = `mongodb://${database.url}`;
    }
    const client = new MongoClient(connectionString, {
      useUnifiedTopology: true,
    });
    await client.connect();
    return client;
  } catch (error) {
    logger.error(error);
  }
}

export default {
  connection,
};
