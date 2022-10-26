import { useCheckHealth } from "../../app/query/check/useCheckHealth";
import ServerError from "../../pages/ServerError";
import { ChildrenProp } from "../../app/consts/props";
import NetworkMaintenance from "../NetworkMaintenance";
import { useCheckNetwork } from "../../app/query/check/useCheckNetwork";
import { Navigate } from "react-router-dom";

const HealthCheck = ({ children }: ChildrenProp) => {
    const { data: dataCheckHealth, isError: isErrorCheckHealth } = useCheckHealth();
    const { data: dataCheckNetwork, isError: isErrorCheckNetwork } = useCheckNetwork();

    if (dataCheckHealth?.status === 403 || dataCheckNetwork?.status === 403) {
        return <Navigate to="/errors/403" />;
    }

    if (
        isErrorCheckHealth ||
        (dataCheckHealth && dataCheckHealth.data.status !== "OK") ||
        isErrorCheckNetwork ||
        (dataCheckNetwork && dataCheckNetwork.data.status === "MAINTENANCE")
    ) {
        return <ServerError />;
    }

    const isMaintenance = dataCheckNetwork && dataCheckNetwork.data.status === "KO";

    return (
        <>
            {isMaintenance && <NetworkMaintenance />}

            {children}
        </>
    );
};

export default HealthCheck;
