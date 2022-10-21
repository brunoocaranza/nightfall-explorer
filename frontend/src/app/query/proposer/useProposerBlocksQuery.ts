import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../axios";
import { LIMIT_PER_PAGE } from "../../utils/helpers";

export interface IBlock {
    blockNumberL2: number;
    blockHash: "string";
    timeBlockL2: string;
    numberOfTransactions: number;
    proposer: string;
}

export interface IProposerBlocksResponse {
    totalDocs: number;
    limit: number;
    totalPages: number;
    page: number;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: number | null;
    nextPage: number | null;
    docs: Array<IBlock>;
}

const fetchProposerBlocks = ({ queryKey }: any): Promise<IProposerBlocksResponse> => {
    const { page, proposer, direction, column, badBlocks } = queryKey[1];

    const params = {
        limit: LIMIT_PER_PAGE,
        page: page ? page : 1,
        sortDirection: direction,
        sortColumn: column,
        proposer,
        badBlocks,
    };

    return axiosInstance.get("/block", { params }).then((response) => response.data);
};

export const useProposerBlocksQuery = (params: any) => {
    return useQuery(["latest-blocks", params], fetchProposerBlocks);
};
