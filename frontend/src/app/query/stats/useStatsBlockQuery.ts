import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../axios";
import { IStatsBlockResponse } from "../../consts/stats";

const fetchStatsTransactions = (): Promise<IStatsBlockResponse> => {
    return axiosInstance.get("/block/stats/count").then((response) => response.data);
};

export const useStatsBlockQuery = () => {
    return useQuery(["stats-block"], fetchStatsTransactions);
};
