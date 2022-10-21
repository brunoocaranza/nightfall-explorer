import { useState } from "react";
import { InfoParam } from "../InfoParam";
import ShowMoreButton from "../Button/ShowMoreButton";
import { useTranslation } from "react-i18next";
import { ITransactionResponse } from "../../app/consts/transactions";
import ItemInfo from "../ItemInfo";
import { TokenNames } from "../../app/consts/token";
import IconEtherscan from "jsx:../../assets/images/icons/etherscan.svg";
import { convertTimestampToUTC, env } from "../../app/utils/helpers";

interface ITransactionInfoProps {
    transaction: ITransactionResponse;
}

const TransactionInfo = ({ transaction }: ITransactionInfoProps) => {
    const { t } = useTranslation();

    const [showMore, setShowMore] = useState<boolean>(false);

    const getEtherScanLink = () => {
        const blockUrl = env("L1_EXPLORER_URL");

        return `${blockUrl}/tx/${transaction.transactionHashL1}`;
    };

    const isOffchain = transaction.transactionHashL1 !== "offchain";
    const showAmount = transaction.tokenType !== "erc_721" && transaction.transactionType !== "transfer";
    const showRecipientAddress = transaction.recipientAddress !== "0" && transaction.transactionType === "withdraw";

    return (
        <ItemInfo>
            <InfoParam title={t("Transaction Hash")} value={transaction.transactionHash} allowCopy />
            <InfoParam title={t("Block Number")} value={transaction.blockNumberL2} />
            <InfoParam title={t("Timestamp")} value={convertTimestampToUTC(transaction.timeBlockL2)} />
            <InfoParam title={t("Fee")} value={transaction.fee} />
            {showAmount && <InfoParam title={t("Amount")} value={transaction.amount} sufix={"WEI"} />}
            {showRecipientAddress && <InfoParam title={t("Recipient Address")} value={transaction.recipientAddress} />}
            <InfoParam title={t("Token Type")} value={TokenNames[transaction.tokenType]} />
            <InfoParam title={t("Token ID")} value={transaction.tokenId} allowCopy />
            {transaction.hasEthScanLink && <InfoParam prefix={<IconEtherscan />} linkUrl={getEtherScanLink()} linkText={t("View on Etherscan")} />}

            {showMore && (
                <>
                    <InfoParam title={t("ETH Transaction Hash")} value={transaction.transactionHashL1} allowCopy={isOffchain} />
                    <InfoParam title={t("ETH Block Number")} value={transaction.blockNumber} />
                    <InfoParam title={t("Compressed Secrets")} value={transaction.compressedSecrets} allowCopy />
                    <InfoParam title={t("ERC Address")} value={transaction.ercAddress} allowCopy />
                    <InfoParam title={t("Historic Root Block Number L2")} value={transaction.historicRootBlockNumberL2} allowCopy />
                    <InfoParam title={t("Mempool")} value={transaction.mempool.toString()} />
                    <InfoParam title={t("Nullifiers")} value={transaction.nullifiers} allowCopy />
                    <InfoParam title={t("Proof")} value={transaction.proof} allowCopy />
                </>
            )}
            <ShowMoreButton value={showMore} className="ml-4 xl:ml-0" onClick={() => setShowMore(!showMore)} />
        </ItemInfo>
    );
};

export default TransactionInfo;
