export interface IStatsAverageBlockCreationResponse {
    timeUnit: string;
    value: number | string;
}

export interface IStatsTransactionResponse {
    transaction: number;
}

export interface IStatsBlockResponse {
    block: number;
}

export interface IStatsChallengedBlocks {
    blockPercentage: any;
    blocksCount: any;
}
