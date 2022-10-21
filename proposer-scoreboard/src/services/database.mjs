import { database } from "../config/constants.mjs";
import mongo from "../config/mongo.mjs";
import moment from "moment";

export async function findOneBlock(args) {
  const blockQuery = {
    ...args,
  };
  const connection = await mongo.connection();
  const db = connection.db(database.name);
  const collection = db.collection("blocks");
  const block = await collection.findOne(blockQuery);
  return block;
}

export async function countBlocksForProposers() {
  try {
    const connection = await mongo.connection();
    const db = connection.db(database.name);
    const collection = db.collection("blocks");
    const result = collection.aggregate(pipeline).toArray();
    return result;
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function countInvalidBlocksForProposers() {
  try {
    const connection = await mongo.connection();
    const db = connection.db(database.name);
    const collection = db.collection("invalid_blocks");
    const result = await collection.aggregate(pipeline).toArray();
    return result;
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function updateProposerData(address, { ...args }) {
  try {
    const connection = await mongo.connection();
    const db = connection.db(database.name);
    const collection = db.collection("proposers-scoreboard");

    const result = await collection.updateOne(
      { _id: address },
      {
        $set: {
          _id: address,
          ...args,
        },
      },
      { upsert: true }
    );
    return result;
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function syncCurrentlyInactiveProposers(proposers) {
  try {
    const connection = await mongo.connection();
    const db = connection.db(database.name);
    const collection = db.collection("proposers-scoreboard");

    const result = collection.updateMany(
      { _id: { $nin: proposers } },
      {
        $set: {
          isActive: false,
        },
      }
    );
    return result;
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function findWeekOldBlocks() {
  const connection = await mongo.connection();
  const db = connection.db(database.name);
  const collection = db.collection("blocks");
  const result = await collection
    .find({ timeBlockL2: { $gte: new Date(moment().subtract(7, "d")) } })
    .toArray();
  return result;
}

const pipeline = [
  {
    $match: {
      proposer: { $not: { $size: 0 } },
    },
  },
  { $unwind: "$proposer" },
  {
    $group: {
      _id: "$proposer",
      count: { $sum: 1 },
    },
  },
  {
    $match: {
      count: { $gte: 2 },
    },
  },
  { $sort: { count: -1 } },
];
