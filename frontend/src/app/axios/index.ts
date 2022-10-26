import axios from "axios";
import { env } from "../utils/helpers";

const axiosInstance = axios.create({
    baseURL: env("API_URL"),
    paramsSerializer: (originalParams) => {
        let result = "";
        const params = JSON.parse(JSON.stringify(originalParams));

        Object.keys(params).forEach((key) => {
            result += `${key}=${encodeURIComponent(params[key])}&`;
        });

        return result.substring(0, result.length - 1);
    },
});
export default axiosInstance;
