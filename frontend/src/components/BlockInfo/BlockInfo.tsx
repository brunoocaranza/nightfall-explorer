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

    const challengedParamsRender = (item: IChallengedBlockResponse) => {
        return (
            <>
                <InfoParam title={t("Error code")} value={item.invalidCode} />
                <InfoParam title={t("Error message")} value={item.invalidMessage} allowCopy />
            </>
        );
    };

    return (
        <ItemInfo>
            <InfoParam title={t("Block hash")} titleInfo={t("Polygon Nightfall block hash")} value={block.blockHash} allowCopy />
            <InfoParam title={t("Block number")} titleInfo={t("Polygon Nightfall block number")} value={block.blockNumberL2} />
            <InfoParam title={t("Proposer address")} value={block.proposer} allowCopy />
            <InfoParam
                title={t("Timestamp")}
                titleInfo={t("Timestamp of the Polygon Nightfall block where the transaction is included")}
                value={convertTimestampToUTC(block.timeBlockL2)}
            />

            {isChallenged && challengedParamsRender(block as IChallengedBlockResponse)}

            {showMore && (
                <>
                    <InfoParam title={t("ETH Block Number")} value={block.blockNumber} />
                    <InfoParam
                        title={t("Leaf count")}
                        titleInfo={t("Number of leafs in the merkle tree of the commitments")}
                        value={block.leafCount}
                    />
                    <InfoParam title={t("Number of commitments")} value={block.nCommitments} />
                    <InfoParam
                        title={t("Previous block hash")}
                        titleInfo={t("Hash of the previous Polygon Nightfall block")}
                        value={block.previousBlockHash}
                        allowCopy
                    />
                    <InfoParam title={t("Root")} titleInfo={t("Hash of the merkle tree root of the transactions")} value={block.root} allowCopy />
                    <InfoParam
                        title={t("Transaction hashes root")}
                        titleInfo={t("Hash calculated from the transactions in the block")}
                        value={block.transactionHashesRoot}
                        allowCopy
                    />
                </>
            )}

            <ShowMoreButton value={showMore} className="ml-4 xl:ml-0" onClick={() => setShowMore(!showMore)} />
        </ItemInfo>
    );
};
export default BlockInfo;
