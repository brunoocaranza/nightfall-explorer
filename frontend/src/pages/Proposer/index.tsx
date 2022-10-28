import { Navigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useProposerInfoQuery } from "../../app/query/proposer/useProposerInfoQuery";
import { CardHeader, CardHeaderPlaceholder } from "../../components/CardHeader";
import { InfoParam } from "../../components/InfoParam";
import { StatisticBlock, StatisticBlockPlaceholder } from "../../components/StatisticBlock";
import { ProposerBlocks, ProposerBlocksPlaceholder } from "../../components/ProposerBlocks";
import ItemInfo from "../../components/ItemInfo";
import { TransactionInfoPlaceholder } from "../../components/TransactionInfo";
import IconProposer from "jsx:../../assets/images/icons/proposer.svg";
import IconTokenMatic from "jsx:../../assets/images/icons/token-matic.svg";
import { IProposerInfoResponse } from "../../app/consts/proposer";

const Proposer = () => {
    const { t } = useTranslation();
    const { hash } = useParams();

    const { data: proposerData, isFetching: isFetchingProposer } = useProposerInfoQuery(String(hash));

    const renderLoading = () => {
        return (
            <>
                <CardHeaderPlaceholder />
                <TransactionInfoPlaceholder numOfItems={3} />
                <StatisticBlockPlaceholder />
                <ProposerBlocksPlaceholder />
            </>
        );
    };

    const renderItem = (proposer: IProposerInfoResponse) => {
        const { url, address, fee, isActive, stats } = proposer;

        return (
            <>
                <CardHeader title={t("Proposer")} icon={<IconProposer />} />

                <ItemInfo>
                    <InfoParam title={t("Proposer URL")} value={url} allowCopy />
                    <InfoParam title={t("Proposer address")} value={address} allowCopy />
                    <InfoParam
                        title={t("Current Fee")}
                        value={fee}
                        valueInfo={!isActive ? t("This Proposer currently is inactive") : ""}
                        prefix={<IconTokenMatic />}
                        sufix="MATIC"
                    />
                </ItemInfo>

                <StatisticBlock stats={stats} />

                <ProposerBlocks proposer={String(hash)} />
            </>
        );
    };

    const render = () => {
        if (isFetchingProposer) {
            return renderLoading();
        }

        if (proposerData) {
            return renderItem(proposerData);
        }

        return <Navigate to="not-found" />;
    };

    return render();
};

export default Proposer;
