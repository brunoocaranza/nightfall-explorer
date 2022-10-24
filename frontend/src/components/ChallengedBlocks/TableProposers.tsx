import { Link } from "react-router-dom";
import { LIMIT_PER_PAGE } from "../../app/utils/helpers";
import { useTranslation } from "react-i18next";
import { IChallengedBlock, IChallengedBlocksResponse } from "../../app/consts/block";

interface ITableBlocks {
    data: IChallengedBlocksResponse | undefined;
    isLoading: boolean;
    isError: boolean;
    page: number;
    error: Error | null | unknown;
}

const TableProposers = ({ data, isLoading, isError, error, page }: ITableBlocks) => {
    const { t } = useTranslation();

    const render = () => {
        if (isLoading) {
            return renderLoading();
        }

        if (isError || !data || !Object.prototype.hasOwnProperty.call(data, "docs")) {
            return renderError();
        }

        if (data.docs.length === 0) {
            return renderEmptyResults();
        }

        return renderList();
    };

    const getPageIndex = (index: number) => {
        const currentPage = page - 1;

        return LIMIT_PER_PAGE * currentPage + index + 1;
    };

    const getStakeAmount = (amount: string) => {
        if (amount === "N/A") return amount;

        return `${amount} WEI`;
    };

    const renderList = () => {
        return data.docs.map((item: IChallengedBlock, index: number) => {
            return (
                <tr key={index}>
                    <td>
                        <span>#</span>
                        {getPageIndex(index)}
                    </td>
                    <td>
                        <span>{t("Proposer Address")}</span>
                        <Link to={`/proposer/${item.address}`}>{item.address}</Link>
                    </td>
                    <td>
                        <span>{t("Good Blocks")}</span>
                        {item.goodBlocks}
                    </td>
                    <td>
                        <span>{t("Bad Blocks")}</span>
                        {item.badBlocks}
                    </td>
                    <td>
                        <span>{t("Stake Amount")}</span>
                        {getStakeAmount(item.stakeAmount)}
                    </td>
                </tr>
            );
        });
    };

    const renderError = () => {
        return (
            <tr>
                <td colSpan={5}>
                    <p className="text-center">{error?.message ?? t("Error occurred, check url and try again!")}</p>
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
                        <div className="w-10 h-5 inline-block animate-pulse bg-gray-300 opacity-50"></div>
                    </td>
                    <td>
                        <div className="w-10 h-5 inline-block animate-pulse bg-gray-300 opacity-50"></div>
                    </td>
                    <td>
                        <div className="w-10 h-5 inline-block animate-pulse bg-gray-300 opacity-50"></div>
                    </td>
                    <td>
                        <div className="w-7 h-5 inline-block animate-pulse bg-gray-300 opacity-50"></div>
                    </td>
                    <td>
                        <div className="w-14 h-5 inline-block animate-pulse bg-gray-300 opacity-50"></div>
                    </td>
                </tr>
            );
        });
    };

    return <>{render()}</>;
};

export default TableProposers;
