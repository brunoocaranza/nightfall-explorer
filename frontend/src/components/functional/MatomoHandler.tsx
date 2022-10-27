import { MatomoProvider } from "@datapunt/matomo-tracker-react";
import { matomoInstance } from "../../app/utils/helpers";

const MatomoHandler = (props: any) => {
    const { children } = props;

    const instance = matomoInstance();

    if (instance) {
        return (
            <MatomoProvider value={instance} {...props}>
                <>{children}</>
            </MatomoProvider>
        );
    }

    return <>{children}</>;
};

export default MatomoHandler;
