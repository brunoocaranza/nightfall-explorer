import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../axios";
import { IStatsAverageBlockCreationResponse } from "../../consts/stats";

const fetchStatsAverageBlockCreation = (): Promise<IStatsAverageBlockCreationResponse> => {
    return axiosInstance.get("/block/stats/avg-creation").then((response) => response.data);
};

export const useStatsAverageBlockCreationQuery = () => {
    return useQuery(["stats-average-block-creation"], fetchStatsAverageBlockCreation);
};
