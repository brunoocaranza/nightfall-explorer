import { useTranslation } from "react-i18next";
import moment from "moment";
import { env } from "../../app/utils/helpers";
import { useContractQuery } from "../../app/query/useContractQuery";
import Logo from "jsx:../../assets/images/logo-purple-black.svg";
import IconArrowLink from "jsx:../../assets/images/icons/arrow-link.svg";
import { IContracts } from "../../app/consts/contract";

const Footer = () => {
    const { t } = useTranslation();
    const currentYear = moment().year();

    const { data, isLoading } = useContractQuery();

    const getLinks = () => {
        if (isLoading || !data) return null;

        const blockUrl = env("L1_EXPLORER_URL");
        const shieldContract = data.find((item: IContracts) => item["shield"]);
        const stateContract = data.find((item: IContracts) => item["state"]);

        return (
            <>
                {shieldContract && (
                    <a href={`${blockUrl}/address/${shieldContract.shield}`} rel="noreferrer" className="mr-6" target="_blank">
                        {t("Shield Contract")}
                        <IconArrowLink className="w-3 h-3 ml-2 mt-[-6] inline" />
                    </a>
                )}
                {stateContract && (
                    <a href={`${blockUrl}/address/${stateContract.state}`} rel="noreferrer" target="_blank">
                        {t("State Contract")}
                        <IconArrowLink className="w-3 h-3 ml-2 mt-[-6] inline" />
                    </a>
                )}
            </>
        );
    };

    return (
        <footer className="container mx-auto md:flex md:justify-between items-center text-gray-400 p-3">
            <div className="table mx-auto mb-6 md:mx-0">
                <Logo />
            </div>
            <div className="table mx-auto mb-6">{getLinks()}</div>
            <div className="table mx-auto mb-6 md:mx-0">
                &copy; {currentYear} {t("Polygon Nightfall")}
            </div>
        </footer>
    );
};

export default Footer;
