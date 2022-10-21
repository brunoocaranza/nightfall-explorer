import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../axios";
import { IContracts } from "../consts/contract";

const fetchContracts = (): Promise<Array<IContracts>> => {
    return axiosInstance.get(`/contracts`).then((response) => response.data);
};

export const useContractQuery = () => {
    return useQuery(["contracts"], () => fetchContracts());
};
