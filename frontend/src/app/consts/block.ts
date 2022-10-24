import { ITransaction } from "./transactions";

export interface ILatestBlock {
    blockNumberL2: number;
    blockHash: string;
    timeBlockL2: string;
    numberOfTransactions: number;
    proposer: string;
}

export interface IChallengedBlock {
    address: string;
    goodBlocks: number;
    badBlocks: number;
    stakeAmount: string;
}

export interface ILatestBlocksResponse {
    totalDocs: number;
    limit: number;
    totalPages: number;
    page: number;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: number | null;
    nextPage: number | null;
    docs: Array<ILatestBlock>;
}

export interface IBlockResponse {
    blockHash: string;
    blockNumber: number;
    blockNumberL2: number;
    numberOfTransactions: number;
    proposer: string;
    leafCount: number;
    nCommitments: number;
    previousBlockHash: string;
    root: string;
    transactionHashesRoot: string;
    timeBlockL2: string;
    transactions: Array<ITransaction>;
}

export interface IChallengedBlockResponse extends IBlockResponse {
    invalidCode: number;
    invalidMessage: string;
}

export type ChallengedBlockTabs = "challenged-blocks" | "proposers";

export interface IChallengedBlocksResponse {
    totalDocs: number;
    limit: number;
    totalPages: number;
    page: number;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: number | null;
    nextPage: number | null;
    docs: Array<ILatestBlock>;
}
