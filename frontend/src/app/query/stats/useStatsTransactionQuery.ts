import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../axios";
import { IStatsTransactionResponse } from "../../consts/stats";

const fetchStatsTransactions = (): Promise<IStatsTransactionResponse> => {
    return axiosInstance.get("/transaction/stats/count").then((response) => response.data);
};

export const useStatsTransactionQuery = () => {
    return useQuery(["stats-transactions"], fetchStatsTransactions);
};
