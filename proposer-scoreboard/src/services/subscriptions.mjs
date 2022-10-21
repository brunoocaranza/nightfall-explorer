import logger from "../config/logger.mjs";
import { blockProposedHandler } from "../event-handlers/block-proposed.mjs";
import { getContractSubscription, getProvider } from "./contract-client.mjs";
const RECONNECT_TIMEOUT = 4000;
class Subscription {
  constructor(contract, eventName, handler) {
    this.contract = contract;
    this.eventName = eventName;
    this.handler = handler;
  }
}

export const initSubscription = () => {
  logger.info("init subscription controller");
  const provider = getProvider();
  const subManager = subscriptionsManager();

  provider._websocket.on("close", (...args) => {
    subManager.stopListening();
    reconnect();
    return;
  });

  provider._websocket.on("open", async () => {
    logger.info(`Connected to websocket`);
    try {
      const contract = await getContractSubscription("State", provider);
      subManager.startListening([
        new Subscription(contract, "BlockProposed", blockProposedHandler),
      ]);
      blockProposedHandler("", false);
    } catch (error) {
      logger.error(error);
      provider._websocket.close();
    }
  });
};

const subscriptionsManager = () => {
  let activeLisiners = [];

  // Create event lisiner for an event
  const createLisiner = ({ contract, eventName, handler }) => {
    contract.on(`${eventName}`, (event) => {
      logger.info(`Incoming Data: ${eventName}`);
      handler(event);
    });
    return contract;
  };

  const startListening = (subscriptions) => {
    logger.info(
      `subscribing to events ${JSON.stringify(
        subscriptions.map((s) => s.eventName)
      )}`
    );
    for (const subscription of subscriptions) {
      activeLisiners.push(createLisiner(subscription));
    }
  };

  const stopListening = () => {
    for (const event of activeLisiners) {
      event.removeAllListeners();
    }
    activeLisiners = [];
    logger.warn(`remove all listeners`);
  };

  return {
    // start lisening for all events in subscriptions array
    startListening,
    // stop Listening for all event in activLisiners array
    stopListening,
  };
};

function reconnect() {
  logger.warn(`reconnecting to a websocket ${RECONNECT_TIMEOUT / 1000} sec`);
  setTimeout(() => {
    initSubscription();
  }, RECONNECT_TIMEOUT);
}
