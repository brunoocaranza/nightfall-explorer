import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../axios";

const fetchCheckHealth = () => {
    return axiosInstance.get("/health/service");
};

export const useCheckHealth = () => {
    return useQuery(["check-health"], fetchCheckHealth);
};
