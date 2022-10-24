export const BLOCK_NUMBER_L2 = "blockNumberL2";
export const TIME_BLOCK_L2 = "timeBlockL2";

export const GOOD_BLOCKS = "goodBlocks";
export const BAD_BLOCKS = "badBlocks";

export type SortByTypes = "blockNumberL2" | "timeBlockL2";
export type SortByProposerTypes = "goodBlocks" | "badBlocks";

export interface ISortDirection {
    [BLOCK_NUMBER_L2]: string;
    [TIME_BLOCK_L2]: string;
}

export interface ISortDirectionProposer {
    [GOOD_BLOCKS]: string;
    [BAD_BLOCKS]: string;
}
