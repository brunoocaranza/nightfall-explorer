import { useState } from "react";
import { InfoParam } from "../InfoParam";
import ShowMoreButton from "../Button/ShowMoreButton";
import { useTranslation } from "react-i18next";
import { IBlockResponse, IChallengedBlockResponse } from "../../app/consts/block";
import ItemInfo from "../ItemInfo";
import { convertTimestampToUTC } from "../../app/utils/helpers";

interface IBlockProps {
    block: IBlockResponse | IChallengedBlockResponse;
    isChallenged?: boolean;
}

const BlockInfo = ({ block, isChallenged }: IBlockProps) => {
    const { t } = useTranslation();

    const [showMore, setShowMore] = useState<boolean>(false);

    return (
        <ItemInfo>
            <InfoParam title={t("Block hash")} value={block.blockHash} allowCopy />
            <InfoParam title={t("Block number")} value={block.blockNumberL2} />
            <InfoParam title={t("Proposer address")} value={block.proposer} allowCopy />
            <InfoParam title={t("Timestamp")} value={convertTimestampToUTC(block.timeBlockL2)} />

            {isChallenged && (
                <>
                    <InfoParam title={t("Error code")} value={block.invalidCode} />
                    <InfoParam title={t("Error message")} value={block.invalidMessage} allowCopy />
                </>
            )}

            {showMore && (
                <>
                    <InfoParam title={t("ETH Block Number")} value={block.blockNumber} />
                    <InfoParam title={t("Leaf count")} value={block.leafCount} />
                    <InfoParam title={t("Number of commitments")} value={block.nCommitments} />
                    <InfoParam title={t("Previous block hash")} value={block.previousBlockHash} allowCopy />
                    <InfoParam title={t("Root")} value={block.root} allowCopy />
                    <InfoParam title={t("Transaction hashes root")} value={block.transactionHashesRoot} allowCopy />
                </>
            )}

            <ShowMoreButton value={showMore} className="ml-4 xl:ml-0" onClick={() => setShowMore(!showMore)} />
        </ItemInfo>
    );
};

export default BlockInfo;
