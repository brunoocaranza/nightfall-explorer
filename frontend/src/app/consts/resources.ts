import { BLOCK_PAGE, PROPOSER_PAGE, TRANSACTION_PAGE, CHALLENGED_BLOCK_PAGE } from "../router/consts";

export type ResourceName = "block" | "block_l1" | "transaction" | "proposer" | "challenged_block" | "challenged_block_l1";

type IResourceNames = {
    [key in ResourceName]: string;
};

export const resourceNames: IResourceNames = {
    block: BLOCK_PAGE,
    block_l1: BLOCK_PAGE,
    transaction: TRANSACTION_PAGE,
    proposer: PROPOSER_PAGE,
    challenged_block: BLOCK_PAGE,
    challenged_block_l1: BLOCK_PAGE,
};
