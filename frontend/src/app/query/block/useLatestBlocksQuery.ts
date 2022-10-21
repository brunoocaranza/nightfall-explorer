import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../axios";
import { LIMIT_PER_PAGE } from "../../utils/helpers";
import { ILatestBlocksResponse } from "../../consts/block";

const fetchLatestBlocks = ({ queryKey }: any): Promise<ILatestBlocksResponse> => {
    const { page, direction, column } = queryKey[1];

    const params = {
        limit: LIMIT_PER_PAGE,
        page: page ? page : 1,
        sortDirection: direction,
        sortColumn: column,
    };

    return axiosInstance.get("/block", { params }).then((response) => response.data);
};

export const useLatestBlocksQuery = (params: any) => {
    return useQuery(["latest-blocks", params], fetchLatestBlocks);
};
