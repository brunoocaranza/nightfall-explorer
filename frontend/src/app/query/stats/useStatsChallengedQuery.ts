import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../axios";
import { IStatsChallengedBlocks } from "../../consts/stats";

const fetchStatsTransactions = (): Promise<IStatsChallengedBlocks> => {
    return axiosInstance.get("/block/challenged/stats").then((response) => response.data);
};

export const useStatsChallengedQuery = () => {
    return useQuery(["stats-challenged-block"], fetchStatsTransactions);
};
