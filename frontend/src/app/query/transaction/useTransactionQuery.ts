import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../axios";
import { ITransactionResponse } from "../../consts/transactions";

const fetchTransaction = (hash: string): Promise<ITransactionResponse> => {
    return axiosInstance.get(`/transaction/${hash}`).then((response) => response.data);
};

export const useTransactionQuery = (hash: string) => {
    return useQuery(["transaction", hash], () => fetchTransaction(hash));
};
