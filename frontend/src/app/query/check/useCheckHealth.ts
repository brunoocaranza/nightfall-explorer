import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../axios";

const fetchCheckHealth = () => {
    return axiosInstance.get("/health/service").then((response) => response.data);
};

export const useCheckHealth = () => {
    return useQuery(["check-health"], fetchCheckHealth);
};
