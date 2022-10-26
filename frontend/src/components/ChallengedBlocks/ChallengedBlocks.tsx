import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import classNames from "classnames";
import { useProposerBlocksQuery } from "../../app/query/proposer/useProposerBlocksQuery";
import { Pagination } from "../Pagination";
import { IPageChange } from "../../app/consts/page";
import { getQueryParam } from "../../app/utils/helpers";
import TableBlocks from "../TableBlocks";
import { BLOCK_NUMBER_L2, ISortDirection, SortByTypes, TIME_BLOCK_L2 } from "../../app/consts/sort";
import IconArrowDownBold from "jsx:../../assets/images/icons/arrow-down-bold.svg";

import "./ChallengedBlockProposers.scss";

const ChallengedBlocks = () => {
    const { t } = useTranslation();

    const [searchParams, setSearchParams] = useSearchParams();

    const page = getQueryParam(searchParams, "page", "1");
    const direction = getQueryParam(searchParams, "direction", "desc");
    const column = getQueryParam(searchParams, "column", BLOCK_NUMBER_L2);

    const [sortDirection, setSortDirection] = useState<ISortDirection>({
        [BLOCK_NUMBER_L2]: column === BLOCK_NUMBER_L2 ? direction : "desc",
        [TIME_BLOCK_L2]: column === TIME_BLOCK_L2 ? direction : "desc",
    });

    const { isLoading, isError, error, data } = useProposerBlocksQuery({
        page,
        direction,
        column,
        badBlocks: 1,
    });

    const onPaginateChange = ({ selected }: IPageChange) => {
        setSearchParams({ page: String(selected + 1), direction, column });
    };

    const sortBy = (sortName: SortByTypes) => {
        const newSortDirection = sortDirection[sortName] === "asc" ? "desc" : "asc";

        setSortDirection({ ...sortDirection, [sortName]: newSortDirection });

        setSearchParams({ page, direction: newSortDirection, column: sortName });
    };

    return (
        <div>
            <div className="nf-table table-blocks mb-20">
                <table className="w-full table-fixed">
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
                        <TableBlocks data={data} isLoading={isLoading} isError={isError} error={error} challengedBlocks showProposer />
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

export default ChallengedBlocks;
