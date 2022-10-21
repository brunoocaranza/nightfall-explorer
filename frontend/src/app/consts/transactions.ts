import { TokenType } from "./token";

export type TransactionType = "deposit" | "withdraw" | "transfer";

export interface ITransaction {
    transactionHash: string;
    transactionType: TransactionType;
}

export type TransactionStatus = "pending" | "available" | null;

export interface ITransactionResponse {
    transactionHash: string;
    transactionHashL1: string;
    transactionType: TransactionType;
    blockNumberL2: number;
    blockNumber: number;
    fee: number;
    mempool: boolean;
    nullifiers: Array<string>;
    proof: Array<string>;
    recipientAddress: string;
    tokenId: string;
    ercAddress: string;
    historicRootBlockNumberL2: Array<string>;
    compressedSecrets: Array<string>;
    amount: number;
    timeBlockL2: string;
    tokenType: TokenType;
    status: TransactionStatus;
    hasEthScanLink: boolean;
}
