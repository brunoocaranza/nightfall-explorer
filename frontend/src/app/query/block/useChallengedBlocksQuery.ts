import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../axios";
import { IChallengedBlocksResponse } from "../../consts/block";
import { LIMIT_PER_PAGE } from "../../utils/helpers";

const fetchChallengedBlocks = ({ queryKey }: any): Promise<IChallengedBlocksResponse> => {
    const { page, proposer, column, direction } = queryKey[1];

    const params = {
        limit: LIMIT_PER_PAGE,
        page: page ? page : 1,
        sortDirection: direction,
        sortColumn: column,
        address: proposer,
    };

    return axiosInstance.get("/proposer", { params }).then((response) => response.data);
};

export const useChallengedBlocksQuery = (params: any) => {
    return useQuery(["latest-blocks", params], fetchChallengedBlocks);
};
