import { ReactNode } from "react";

interface ISentryHandler {
    children: ReactNode;
    error: Error;
}

const SentryHandler = ({ children, error }: ISentryHandler) => {
    console.log(error);

    return <>{children}</>;
};

export default SentryHandler;
