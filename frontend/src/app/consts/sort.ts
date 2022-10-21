export const BLOCK_NUMBER_L2 = "blockNumberL2";
export const TIME_BLOCK_L2 = "timeBlockL2";

export type SortByTypes = "blockNumberL2" | "timeBlockL2";

export interface ISortDirection {
    [BLOCK_NUMBER_L2]: string;
    [TIME_BLOCK_L2]: string;
}
