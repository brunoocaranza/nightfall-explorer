import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../axios";
import { IBlockResponse } from "../../consts/block";

const fetchBlock = (blockNumber: number): Promise<IBlockResponse> => {
    return axiosInstance.get(`/block/${blockNumber}`).then((response) => response.data);
};

export const useBlockQuery = (blockNumber: number, isChallenged: boolean) => {
    return useQuery(["block", blockNumber + String(isChallenged)], () => fetchBlock(blockNumber), {
        enabled: !isChallenged,
    });
};
