import { LIMIT_PER_PAGE } from "../../app/utils/helpers";
import { useTranslation } from "react-i18next";

const ProposerBlocksPlaceholder = () => {
    const { t } = useTranslation();
    return (
        <div className="container mx-auto mt-16 max-w-7xl w-11/12 xl:w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 ">
                <h2 className="text-3xl font-semibold">{t("Blocks")}</h2>
                <div className="mb-4 w-32 h-8 rounded-lg animate-pulse bg-gray-200 justify-self-end"></div>
            </div>
            <div className="nf-table table-proposer mb-20">
                <table>
                    <thead className="hidden w-full lg:table-header-group">
                        <tr>
                            <th> {t("Block")}</th>
                            <th>{t("Block Hash")}</th>
                            <th>{t("Number of Transactions")}</th>
                            <th> {t("Time")}</th>
                        </tr>
                    </thead>
                    <tbody className="border-b border-gray-200">
                        {Array.from(Array(LIMIT_PER_PAGE).keys()).map((index) => {
                            return (
                                <tr key={index} className="placeholder">
                                    <td>
                                        <div className="w-10 h-5 inline-block animate-pulse bg-gray-200 opacity-50"></div>
                                    </td>
                                    <td>
                                        <div className="w-10 h-5 inline-block animate-pulse bg-gray-200 opacity-50"></div>
                                    </td>
                                    <td>
                                        <div className="w-7 h-5 inline-block animate-pulse bg-gray-200 opacity-50"></div>
                                    </td>
                                    <td>
                                        <div className="w-14 h-5 inline-block animate-pulse bg-gray-200 opacity-50"></div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProposerBlocksPlaceholder;
