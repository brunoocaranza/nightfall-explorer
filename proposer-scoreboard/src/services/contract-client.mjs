import axios from "axios";
import { nightfall } from "../config/constants.mjs";
import logger from "../config/logger.mjs";
import ethers from "ethers";

let providerInstance = null;
let contracts = {};

const EXPECTED_PONG_BACK = 15000;
const KEEP_ALIVE_CHECK_INTERVAL = 7500;

export const getProvider = () => {
  if (providerInstance) {
    return providerInstance;
  }

  const provider = new ethers.providers.WebSocketProvider(
    nightfall.blockchain_ws
  );
  providerInstance = provider;
  let pingTimeout = null;
  let keepAliveInterval = null;

  // handle error when ws is not available
  provider._websocket.on("error", (error) => {
    provider._websocket.terminate();
    providerInstance = null;
    logger.error(error);
  });

  provider._websocket.on("open", () => {
    keepAliveInterval = setInterval(() => {
      logger.debug("Checking if the connection is alive, sending a ping");
      provider._websocket.ping();
      // Use `WebSocket#terminate()`, which immediately destroys the connection,
      // instead of `WebSocket#close()`, which waits for the close timer.
      // Delay should be equal to the interval at which your server
      // sends out pings plus a conservative assumption of the latency.
      pingTimeout = setTimeout(() => {
        provider._websocket.terminate();
      }, EXPECTED_PONG_BACK);
    }, KEEP_ALIVE_CHECK_INTERVAL);
  });
  provider._websocket.on("close", () => {
    logger.error("The websocket connection was closed");
    clearInterval(keepAliveInterval);
    clearTimeout(pingTimeout);
    contracts = {};
    providerInstance = null;
  });

  provider._websocket.on("pong", () => {
    logger.debug("Received pong, so connection is alive, clearing the timeout");
    clearInterval(pingTimeout);
  });

  return providerInstance;
};

export const getContractSubscription = async (contractName) => {
  try {
    if (!contractName) {
      throw new Error("Invalid input params");
    }

    if (contracts[contractName]) {
      return contracts[contractName];
    }

    const { nightfall_optimist_url } = nightfall;
    const contractAddress = await getContractAddress({
      nightfall_optimist_url,
      contractName,
    });
    const { abi } = await requestContractABI({
      nightfall_optimist_url,
      contractName,
    });

    const contract = new ethers.Contract(
      contractAddress,
      abi,
      providerInstance
    );
    contracts[contractName] = contract;
    return contract;
  } catch (error) {
    return Promise.reject(error);
  }
};

async function getContractAddress({ nightfall_optimist_url, contractName }) {
  try {
    const result = await axios.get(
      `${nightfall_optimist_url}/contract-address/${contractName}`
    );
    if (!result || !result.data || !result.data.address) {
      return Promise.reject("Could not fetch address from State contract");
    }
    const { data } = result;
    logger.info(
      `Fetched address for ${contractName} contract address: ${data.address}`
    );
    return data.address;
  } catch (error) {
    return Promise.reject(
      `Could not get address from State contract: ${error}`
    );
  }
}

async function requestContractABI({ nightfall_optimist_url, contractName }) {
  try {
    const response = await axios.get(
      `${nightfall_optimist_url}/contract-abi/${contractName}`
    );
    if (!response.data || !response.data.abi) {
      return Promise.reject("Could not extract ABI from State contract");
    }

    logger.info("Got ABI from Optimist");
    return response.data;
  } catch (error) {
    return Promise.reject(
      `Cloud not extract ABI from State contract: ${error}`
    );
  }
}
