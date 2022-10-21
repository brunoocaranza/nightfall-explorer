import { useCheckHealth } from "../../app/query/check/useCheckHealth";
import ServerError from "../../pages/ServerError";
import { ChildrenProp } from "../../app/consts/props";
import NetworkMaintenance from "../NetworkMaintenance";
import { useCheckNetwork } from "../../app/query/check/useCheckNetwork";

const HealthCheck = ({ children }: ChildrenProp) => {
    const { data: dataCheckHealth, isError: isErrorCheckHealth } = useCheckHealth();
    const { data: dataCheckNetwork, isError: isErrorCheckNetwork } = useCheckNetwork();

    if (
        isErrorCheckHealth ||
        (dataCheckHealth && dataCheckHealth.status !== "OK") ||
        isErrorCheckNetwork ||
        (dataCheckNetwork && dataCheckNetwork.status === "MAINTENANCE")
    ) {
        return <ServerError />;
    }

    const isMaintenance = dataCheckNetwork && dataCheckNetwork.status === "KO";

    return (
        <>
            {isMaintenance && <NetworkMaintenance />}

            {children}
        </>
    );
};

export default HealthCheck;
