import { useStatsChallengedQuery } from "../../app/query/stats/useStatsChallengedQuery";
import IconBlockCreated from "jsx:../../assets/images/icons/blocks.svg";
import IconChallengedBlocks from "jsx:../../assets/images/icons/proposer-challenged-blocks.svg";

import { useTranslation } from "react-i18next";

const ChallengedHeader = () => {
    const { t } = useTranslation();

    const { data: blocks, isLoading: isLoadingBlock, isError: isErrorBlock } = useStatsChallengedQuery();

    const renderLoading = () => {
        return <div className="w-10 h-7 animate-pulse opacity-50 inline-block bg-gray-100 mx-auto"></div>;
    };

    const renderValue = (isLoading: boolean, isError: boolean, value: string | number) => {
        if (isLoading) return renderLoading();
        if (isError) return <>{t("N/A")}</>;

        return <>{value}</>;
    };

    return (
        <div className="explorer__header mt-[-80] pt-28 pb-8 lg:pb-24 text-white bg-primary-500 relative text-white text-center">
            <div className="container max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-2 lg:grid-cols-2 justify-items-center">
                    <div className="mb-4">
                        <div className="w-24 h-24 mb-2 flex items-center justify-center mx-auto bg-primary-300 rounded-full">
                            <IconBlockCreated />
                        </div>
                        <div className="px-2">
                            <h3 className="text-4xl font-black">
                                {renderValue(isLoadingBlock, isErrorBlock, blocks ? `${blocks.blockPercentage} %` : t("N/A"))}
                            </h3>
                            <p className="text-sm">{t("% of challenged blocks")}</p>
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="w-24 h-24 mb-2 flex items-center justify-center mx-auto bg-primary-300 rounded-full">
                            <IconChallengedBlocks />
                        </div>
                        <div className="px-2">
                            <h3 className="text-4xl font-black">
                                {renderValue(isLoadingBlock, isErrorBlock, blocks ? `${blocks.blocksCount}` : t("N/A"))}
                            </h3>
                            <p className="text-sm">{t("number of challenged blocks")}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChallengedHeader;
