export interface IStats {
    blocks: string;
    goodBlocks: string;
    badBlocks: string;
    challengedBlocks: string;
}

export interface IProposerInfoResponse {
    fee: number;
    address: string;
    url: string;
    stats: IStats;
    isActive: boolean;
}
