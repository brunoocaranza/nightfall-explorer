import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { server } from "./config/constants.mjs";
import logger from "./config/logger.mjs";
import { getAvgBlockTime } from "./services/block.mjs";
import { initSubscription } from "./services/subscriptions.mjs";

initSubscription();

const app = express();
const port = server.port;

app.get("/health", (req, res) => {
  res.send("Hello World!");
});

app.get("/block/avg-time", async (req, res) => {
  try {
    const result = await getAvgBlockTime();
    res.json(result);
  } catch (error) {
    logger.error(error);
    res.status(500).send(error);
  }
});

app.listen(port, () => {
  logger.info(`Service app listening on port ${port}`);
});
