import { Navigate, useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useBlockQuery } from "../../app/query/block/useBlockQuery";
import { TransactionHistory, TransactionHistoryPlaceholder } from "../../components/TransactionHistory";
import { CardHeader, CardHeaderPlaceholder } from "../../components/CardHeader";
import { BlockInfo, BlockInfoPlaceholder } from "../../components/BlockInfo";
import { useChallengedBlock } from "../../app/query/block/useChallengedBlock";
import { IBlockResponse, IChallengedBlockResponse } from "../../app/consts/block";
import IconBlock from "jsx:../../assets/images/icons/blocks.svg";

const Block = () => {
    const { hash } = useParams();
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const isChallenged = searchParams.get("challenged") === String(1);

    const { data: challengedBlockData, isFetching: isFetchingChallengedBlock } = useChallengedBlock(Number(hash), isChallenged);

    const { data: blockData, isFetching: isFetchingBlock } = useBlockQuery(Number(hash), isChallenged);

    const renderLoading = () => {
        return (
            <>
                <CardHeaderPlaceholder />
                <BlockInfoPlaceholder numOfItems={5} />
                <TransactionHistoryPlaceholder numOfItems={10} />
            </>
        );
    };

    const renderItem = (data: IBlockResponse | IChallengedBlockResponse) => {
        const { transactions, numberOfTransactions } = data;

        return (
            <>
                <CardHeader title={t("Block info")} icon={<IconBlock className="w-14 h-14" />} />
                <BlockInfo block={data} isChallenged={isChallenged} />
                <TransactionHistory transactions={transactions} numberOfTransactions={numberOfTransactions} />
            </>
        );
    };

    const render = () => {
        if (isFetchingBlock || isFetchingChallengedBlock) {
            return renderLoading();
        }

        if (blockData || challengedBlockData) {
            return renderItem(blockData ?? (challengedBlockData as IBlockResponse | IChallengedBlockResponse));
        }

        return <Navigate to="not-found" />;
    };

    return render();
};

export default Block;
