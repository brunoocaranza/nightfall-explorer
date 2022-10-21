import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../axios";
import { IChallengedBlockResponse } from "../../consts/block";

const fetchChallengedBlock = (blockNumber: number): Promise<IChallengedBlockResponse> => {
    return axiosInstance.get(`/block/${blockNumber}/challenged`).then((response) => response.data);
};

export const useChallengedBlock = (blockNumber: number, isChallenged: boolean) => {
    return useQuery(["challenged-block", blockNumber], () => fetchChallengedBlock(blockNumber), {
        enabled: isChallenged,
    });
};
