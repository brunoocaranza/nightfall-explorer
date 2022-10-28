import { useTranslation } from "react-i18next";
import { useStatsBlockQuery } from "../../app/query/stats/useStatsBlockQuery";
import { useStatsTransactionQuery } from "../../app/query/stats/useStatsTransactionQuery";
import { useStatsAverageBlockCreationQuery } from "../../app/query/stats/useStatsAverageBlockCreationQuery";
import { useStatsPendingTransaction } from "../../app/query/stats/useStatsPendingTransactionQuery";
import { IStatsBlockResponse, IStatsTransactionResponse } from "../../app/consts/stats";
import IconBlockCreated from "jsx:../../assets/images/icons/blocks.svg";
import IconTransactions from "jsx:../../assets/images/icons/transactions.svg";
import IconAvgBlockCreation from "jsx:../../assets/images/icons/avg-block-creation.svg";
import IconPendingTransactions from "jsx:../../assets/images/icons/pending-transactions.svg";

import "./ExplorerHeader.scss";

const ExplorerHeader = () => {
    const { t } = useTranslation();

    const { data: blocks, isLoading: isLoadingBlock, isError: isErrorBlock } = useStatsBlockQuery();
    const { data: transactions, isLoading: isLoadingTransaction, isError: isErrorTransaction } = useStatsTransactionQuery();
    const {
        data: averageBlockCreation,
        isLoading: isLoadingAverageBlockCreation,
        isError: isErrorAverageBlockCreation,
    } = useStatsAverageBlockCreationQuery();
    const { data: pendingTransactions, isLoading: isLoadingPendingTransactions, isError: isErrorPendingTransactions } = useStatsPendingTransaction();

    const renderLoading = () => {
        return <div className="w-10 h-7 animate-pulse opacity-50 inline-block bg-gray-100 mx-auto"></div>;
    };

    const renderValue = (isLoading: boolean, isError: boolean, value: string | IStatsTransactionResponse | IStatsBlockResponse | undefined) => {
        if (isLoading) return renderLoading();
        if (isError) return <>{t("N/A")}</>;

        return <>{value}</>;
    };

    return (
        <div className="explorer__header mt-[-80] pt-28 pb-24 text-white bg-primary-500 relative text-white text-center">
            <div className="container max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-2 lg:grid-cols-4 justify-items-center">
                    <div className="mb-4">
                        <div className="w-24 h-24 mb-2 flex items-center justify-center mx-auto bg-primary-300 rounded-full">
                            <IconBlockCreated />
                        </div>
                        <div>
                            <h3 className="text-4xl font-black">{renderValue(isLoadingBlock, isErrorBlock, blocks)}</h3>
                            <p className="text-sm">{t("Blocks Created")}</p>
                        </div>
                    </div>
                    <div className="mb-4">
                        <div className="w-24 h-24 mb-2 flex items-center justify-center mx-auto bg-primary-300 rounded-full">
                            <IconTransactions />
                        </div>
                        <div>
                            <h3 className="text-4xl font-black">{renderValue(isLoadingTransaction, isErrorTransaction, transactions)}</h3>
                            <p className="text-sm">{t("Total Transactions")}</p>
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="w-24 h-24 mb-2 flex items-center justify-center mx-auto bg-primary-300 rounded-full">
                            <IconPendingTransactions />
                        </div>
                        <div>
                            <h3 className="text-4xl font-black">
                                {renderValue(isLoadingPendingTransactions, isErrorPendingTransactions, pendingTransactions)}
                            </h3>
                            <p className="text-sm">{t("Pending Transactions")}</p>
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="w-24 h-24 mb-2 flex items-center justify-center mx-auto bg-primary-300 rounded-full">
                            <IconAvgBlockCreation />
                        </div>
                        <div>
                            <h3 className="text-4xl font-black">
                                {renderValue(
                                    isLoadingAverageBlockCreation,
                                    isErrorAverageBlockCreation,
                                    averageBlockCreation ? averageBlockCreation.value + " " + averageBlockCreation.timeUnit : ""
                                )}
                            </h3>
                            <p className="text-sm">{t("Avg. Block Creation")}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExplorerHeader;
