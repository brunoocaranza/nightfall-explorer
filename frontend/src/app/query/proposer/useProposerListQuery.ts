import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../axios";
import { reduceHash } from "../../utils/helpers";

const fetchProposerList = () => {
    return axiosInstance.get("/proposer/addresses/list").then((response) => response.data);
};

export const useProposerListQuery = () => {
    return useQuery(["latest-blocks"], fetchProposerList, {
        select: (data) => {
            return data.map((proposer: string) => ({ label: reduceHash(proposer), value: proposer }));
        },
    });
};
