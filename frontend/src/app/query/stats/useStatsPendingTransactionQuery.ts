import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../axios";

const fetchStatsPendingTransaction = (): Promise<any> => {
    // TODO Add interface instead any
    return axiosInstance.get("/transaction/stats/pending/count").then((response) => response.data);
};

export const useStatsPendingTransaction = () => {
    return useQuery(["stats-pending-transaction"], fetchStatsPendingTransaction);
};
