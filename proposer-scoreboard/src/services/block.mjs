import logger from "../config/logger.mjs";
import moment from "moment";
import { findWeekOldBlocks, findOneBlock } from "../services/database.mjs";

let avgBlockTime = {
  timeUnit: "h",
  value: 0,
};

export function findBlockByNumber(blockNumber) {
  return findOneBlock({ blockNumber });
}

/**
 * Calculating average block time creation based on blocks created in last 7 days. This method finds difference (in seconds)
 * between first and last block in 7 days period and divide that value with number of all blocks s
 * @returns value: as avg time, timeUnit: in what unit values is ('h', 'm', 's')
 */
export async function calculateAvgTime() {
  try {
    logger.debug("Calculating average block time");
    const blocks = await findWeekOldBlocks();
    if (blocks.length > 1) {
      blocks.sort((a, b) => a.blockNumberL2 - b.blockNumberL2);
      const minDate = blocks[0].timeBlockL2;
      const maxDate = blocks[blocks.length - 1].timeBlockL2;

      const timeDiff = moment(maxDate).diff(moment(minDate), "seconds");
      const averageSeconds = timeDiff / blocks.length - 1;

      avgBlockTime = determineAverageTimeType(averageSeconds);
      logger.info(
        `Average block time: ${avgBlockTime.value} ${avgBlockTime.timeUnit}`
      );
      return avgBlockTime;
    }
  } catch (error) {
    logger.error(`Calculating averge time for block failed: ${error}`);
    return Promise.reject(error);
  }
}

export async function getAvgBlockTime() {
  return avgBlockTime;
}

/**
 * We expect that block will be created every 6 hours but we must cover cases when that could happend much frequently.
 * This is function checks what is the best timeUnit to present average block time
 * @param averageSeconds average block time creation represented in seconds
 * @returns
 */
function determineAverageTimeType(averageSeconds) {
  // Expected time unit is HOUR. Block creation should happend on every 6 hours
  let result = {
    timeUnit: "h",
    value: Math.floor(averageSeconds / 3600),
  };

  if (averageSeconds < 60)
    result = {
      timeUnit: "s",
      value: Math.floor(averageSeconds),
    };
  else if (averageSeconds < 3600)
    result = {
      timeUnit: "m",
      value: Math.floor(averageSeconds / 60),
    };

  return result;
}
