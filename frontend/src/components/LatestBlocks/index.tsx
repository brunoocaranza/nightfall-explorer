import { useState } from "react";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import { useSearchParams } from "react-router-dom";
import { useLatestBlocksQuery } from "../../app/query/block/useLatestBlocksQuery";
import { getQueryParam } from "../../app/utils/helpers";
import { Pagination } from "../Pagination";
import TableBlocks from "../TableBlocks";
import { IPageChange } from "../../app/consts/page";
import { BLOCK_NUMBER_L2, ISortDirection, SortByTypes, TIME_BLOCK_L2 } from "../../app/consts/sort";
import IconArrowDownBold from "jsx:../../assets/images/icons/arrow-down-bold.svg";

interface ILatestBlocksProps {
    scrollToInput: () => void;
}

const LatestBlocks = ({ scrollToInput }: ILatestBlocksProps) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const page = getQueryParam(searchParams, "page", "1");
    const direction = getQueryParam(searchParams, "direction", "desc");
    const column = getQueryParam(searchParams, "column", BLOCK_NUMBER_L2);

    const [sortDirection, setSortDirection] = useState<ISortDirection>({
        [BLOCK_NUMBER_L2]: column === BLOCK_NUMBER_L2 ? direction : "desc",
        [TIME_BLOCK_L2]: column === TIME_BLOCK_L2 ? direction : "desc",
    });

    const { t } = useTranslation();

    const { isLoading, isError, error, data } = useLatestBlocksQuery({
        page,
        direction,
        column,
    });

    const onPaginateChange = ({ selected }: IPageChange) => {
        setSearchParams({ page: String(selected + 1), direction, column });

        scrollToInput();
    };

    const sortBy = (sortName: SortByTypes) => {
        const newSortDirection = sortDirection[sortName] === "asc" ? "desc" : "asc";

        setSortDirection({ ...sortDirection, [sortName]: newSortDirection });

        setSearchParams({ page, direction: newSortDirection, column: sortName });
    };

    return (
        <div className="container mx-auto mt-16 max-w-7xl w-11/12 xl:w-full">
            <div className="flex justify-between">
                <h2 className="mb-7 text-3xl font-semibold">{t("Latest blocks")}</h2>
                <button aria-label={t("Sort ASC/DESC")} className="btn-white px-3 py-4 h-0 md:hidden" onClick={() => sortBy("blockNumberL2")}>
                    <IconArrowDownBold className={classNames({ "rotate-180": sortDirection[BLOCK_NUMBER_L2] === "desc" })} />
                </button>
            </div>
            <div className="nf-table table-blocks mb-20">
                <table className="table-fixed">
                    <thead className="hidden w-full md:table-header-group">
                        <tr>
                            <th onClick={() => sortBy(BLOCK_NUMBER_L2)}>
                                {t("Block")}
                                <IconArrowDownBold
                                    className={classNames("inline align-baseline ml-2", {
                                        "rotate-180": sortDirection[BLOCK_NUMBER_L2] === "desc",
                                    })}
                                />
                            </th>
                            <th>{t("Block Hash")}</th>
                            <th>{t("Proposer Address")}</th>
                            <th>{t("Number of Transactions")}</th>
                            <th onClick={() => sortBy(TIME_BLOCK_L2)}>
                                {t("Time")}
                                <IconArrowDownBold
                                    className={classNames("inline align-baseline ml-2", {
                                        "rotate-180": sortDirection[TIME_BLOCK_L2] === "desc",
                                    })}
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <TableBlocks data={data} isLoading={isLoading} isError={isError} error={error} showProposer />
                    </tbody>
                    {!isLoading && !isError && data.totalPages > 1 && (
                        <tfoot className="table w-full md:contents">
                            <tr>
                                <td colSpan={5} className="p-3 text-center">
                                    <Pagination
                                        page={page === 0 ? page : page - 1}
                                        totalPages={data.totalPages}
                                        onPaginateChange={(selectedPage: IPageChange) => onPaginateChange(selectedPage)}
                                    />
                                </td>
                            </tr>
                        </tfoot>
                    )}
                </table>
            </div>
        </div>
    );
};

export default LatestBlocks;
