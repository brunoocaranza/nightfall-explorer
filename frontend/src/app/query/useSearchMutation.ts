import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../axios";
import { ResourceName } from "../consts/resources";

export interface ISearchValue {
    value: string;
    type: ResourceName;
}

export interface ISearchResponse {
    [index: number]: Array<ISearchValue>;
}

const fetchSearch = (term: string) => {
    return axiosInstance.get("/search", { params: { q: term } }).then((response) => response.data);
};

export const useSearchMutation = (term: string) => {
    return useMutation(() => fetchSearch(term));
};
