import logger from "../config/logger.mjs";
import { syncProposersScoreboard } from "../services/proposer.mjs";
import { calculateAvgTime, findBlockByNumber } from "../services/block.mjs";

const RETRAIS = 10;

export async function blockProposedHandler(event, noCheck = false) {
  const blockNumber = event.blockNumber;
  // query db for block with blockNumber
  // set interval untill it finds block number
  // if no check set it will not wait for optimist to insert a block
  if (noCheck) {
    let i = 0;
    const dbUpdated = new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
        i++;
        const block = await findBlockByNumber(blockNumber);
        if (block) {
          clearInterval(interval);
          resolve(block);
        }
        if (i === RETRAIS) {
          logger.info(
            "Could not get block. Aborting attempt - sync proposer anyway"
          );
          clearInterval(interval);
          resolve();
        } else {
          logger.info(`Waiting for block ${blockNumber} to be indexed`);
        }
      }, 10000);
    });

    await dbUpdated;
    logger.info(`Block ${blockNumber} indexed`);
  }

  const proposers = await syncProposersScoreboard();
  calculateAvgTime();

  if (Object.keys(proposers).length === 0) logger.info(`No proposers found`);
  for (const address of Object.keys(proposers)) {
    logger.info(`Proposer: ${address} - updated`);
  }
  return;
}
