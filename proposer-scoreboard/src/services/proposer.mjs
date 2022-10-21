import { getContractSubscription, getProvider } from "./contract-client.mjs";
import {
  updateProposerData,
  syncCurrentlyInactiveProposers,
  countBlocksForProposers,
  countInvalidBlocksForProposers,
} from "./database.mjs";

export async function syncProposersScoreboard() {
  try {
    // Distincted proposers from blocks collection with their count
    const goodBlockCounts = await countBlocksForProposers();
    // Distincted proposers from invalid-blocks collection with their count
    const badBlockCounts = await countInvalidBlocksForProposers();

    let proposers = goodBlockCounts.reduce((agg, proposer) => {
      agg[proposer._id] = {
        goodBlocks: proposer.count || 0,
      };
      return agg;
    }, {});

    proposers = badBlockCounts.reduce((agg, proposer) => {
      agg[proposer._id] = {
        ...proposer[proposer._id],
        badBlocks: proposer.count || 0,
      };
      return agg;
    }, proposers);

    const activeProposers = await getAllProposers();

    for (const address of Object.keys(activeProposers)) {
      const stakeAccount = await getStakeAccount(address);
      if (proposers[address.toLowerCase()] !== undefined) {
        proposers[address] = {
          ...proposers[address],
          ...activeProposers[address],
          stakeAccount,
          isActive: true,
        };
      } else {
        await updateProposerData(address, {
          ...activeProposers[address],
          stakeAccount,
          isActive: true,
        });
      }
    }

    await syncCurrentlyInactiveProposers(Object.keys(activeProposers));

    for (const address of Object.keys(proposers)) {
      await updateProposerData(address, proposers[address]);
    }

    return proposers;
  } catch (error) {
    return Promise.reject(error);
  }
}

/**
 * Calls current proposer from State contract
 * @returns
 */
export async function getCurrentProposer() {
  try {
    //TODO
    const provider = await getProvider();
    const contract = await getContractSubscription("State", provider);
    const currentProposer = await contract.currentProposer();
    const proposer = {
      address: currentProposer.thisAddress,
      url: currentProposer.url,
    };
    return proposer;
  } catch (error) {
    return Promise.reject(error);
  }
}

/**
 * Find proposers by iterating though on-chain mapping. The safest to start with is the currentProposer
 * @returns Record<proposerAddress, ProposerDTO>
 */
export async function getAllProposers() {
  const currentProposer = await getCurrentProposer();
  const proposers = {};
  let thisPtr = currentProposer.address;

  do {
    if (!thisPtr) break;
    const { thisAddress, nextAddress, url } = await callProposers(thisPtr);
    proposers[`${thisAddress}`] = { address: thisAddress, url };
    thisPtr = nextAddress;
  } while (thisPtr !== currentProposer.address);

  return proposers;
}

export async function callProposers(address) {
  try {
    const contract = await getContractSubscription(
      "State",
      await getProvider()
    );
    const proposer = await contract.getProposer(address);
    return {
      thisAddress: proposer.thisAddress,
      nextAddress: proposer.nextAddress,
      url: proposer.url,
    };
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function getStakeAccount(proposer) {
  try {
    const contract = await getContractSubscription(
      "State",
      await getProvider()
    );
    const result = await contract.getStakeAccount(proposer);

    let stakeAccount = {};
    if (result)
      stakeAccount = {
        amount: result[0] || "0", // The amount held
        challengeLocked: result[1] || "0", // The amount locked by block proposed still in CHALLENGE_PERIOD and not claimed
        time: result[2] || "0", // The time the funds were locked from
      };
    return stakeAccount;
  } catch (error) {
    return Promise.reject(error);
  }
}
