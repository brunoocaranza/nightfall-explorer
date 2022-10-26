import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../axios";

const fetchCheckNetwork = () => {
    return axiosInstance.get("/health/network");
};

export const useCheckNetwork = () => {
    return useQuery(["check-network"], fetchCheckNetwork);
};
