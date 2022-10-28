import { Link } from "react-router-dom";
import { LIMIT_PER_PAGE, reduceHash } from "../../app/utils/helpers";
import moment from "moment/moment";
import { useTranslation } from "react-i18next";
import { ILatestBlock, ILatestBlocksResponse } from "../../app/consts/block";

import "./TableBlocks.scss";

interface ITableBlocks {
    data: ILatestBlocksResponse | undefined;
    isLoading: boolean;
    isError: boolean;
    showProposer?: boolean;
    challengedBlocks?: boolean;
    error: Error | null | unknown;
}

const TableBlocks = ({ data, isLoading, isError, showProposer, challengedBlocks, error }: ITableBlocks) => {
    const { t } = useTranslation();

    const render = () => {
        if (isLoading) {
            return renderLoading();
        }

        if (isError || !data || !Object.prototype.hasOwnProperty.call(data, "docs")) {
            const tmpError = error as Error;

            return renderError(tmpError.message ?? t("Error occurred, check url and try again!"));
        }

        if (data && data.docs.length === 0) {
            return renderEmptyResults();
        }

        return renderList(data.docs);
    };

    const renderList = (list: Array<ILatestBlock>) => {
        return list.map((item: ILatestBlock) => {
            return (
                <tr key={`${item.blockNumberL2}}`}>
                    <td>
                        <span>{t("Block")}</span>
                        <Link to={`/block/${item.blockNumberL2}${challengedBlocks ? "?challenged=1" : ""}`}>{item.blockNumberL2}</Link>
                    </td>
                    <td>
                        <span>{t("Block Hash")}</span>
                        <Link to={`/block/${item.blockNumberL2}${challengedBlocks ? "?challenged=1" : ""}`}>
                            {showProposer ? reduceHash(item.blockHash) : item.blockHash}
                        </Link>
                    </td>
                    {showProposer && (
                        <td>
                            <span>{t("Proposer Address")}</span>
                            <Link to={`/proposer/${item.proposer}`}>{reduceHash(item.proposer)}</Link>
                        </td>
                    )}
                    <td>
                        <span>{t("Number of Transactions")}</span>
                        {item.numberOfTransactions}
                    </td>
                    <td>{moment(item.timeBlockL2).fromNow()}</td>
                </tr>
            );
        });
    };

    const renderError = (message: string) => {
        return (
            <tr>
                <td colSpan={5}>
                    <p className="text-center error">{message}</p>
                </td>
            </tr>
        );
    };

    const renderEmptyResults = () => {
        return (
            <tr>
                <td colSpan={5} className="empty">
                    {t("Empty results.")}
                </td>
            </tr>
        );
    };

    const renderLoading = () => {
        return Array.from(Array(LIMIT_PER_PAGE).keys()).map((index) => {
            return (
                <tr key={index} className="placeholder">
                    <td>
                        <div className="w-10 h-5 inline-block animate-pulse bg-gray-200 opacity-50"></div>
                    </td>
                    <td>
                        <div className="w-20 h-5 inline-block animate-pulse bg-gray-200 opacity-50"></div>
                    </td>
                    {showProposer && (
                        <td>
                            <div className="w-20 h-5 inline-block animate-pulse bg-gray-200 opacity-50"></div>
                        </td>
                    )}
                    <td>
                        <div className="w-7 h-5 inline-block animate-pulse bg-gray-200 opacity-50"></div>
                    </td>
                    <td>
                        <div className="w-14 h-5 inline-block animate-pulse bg-gray-200 opacity-50"></div>
                    </td>
                </tr>
            );
        });
    };

    return <>{render()}</>;
};

export default TableBlocks;
