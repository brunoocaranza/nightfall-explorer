import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../axios";
import { IProposerInfoResponse } from "../../consts/proposer";

const fetchProposerInfo = (proposer: string): Promise<IProposerInfoResponse> => {
    return axiosInstance.get(`/proposer/${proposer}`).then((response) => response.data);
};

export const useProposerInfoQuery = (hash: string) => {
    return useQuery(["proposer-info", hash], () => fetchProposerInfo(hash));
};
