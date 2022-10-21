import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import classNames from "classnames";
import { useProposerBlocksQuery } from "../../app/query/proposer/useProposerBlocksQuery";
import { IPageChange } from "../../app/consts/page";
import { getQueryParam } from "../../app/utils/helpers";
import BlockSwitch from "../Swich/BlockSwitch";
import TableBlocks from "../TableBlocks";
import { Pagination } from "../Pagination";
import IconArrowDownBold from "jsx:../../assets/images/icons/arrow-down-bold.svg";

import "./ProposerBlocks.scss";
import { useState } from "react";
import { BLOCK_NUMBER_L2, ISortDirection, SortByTypes, TIME_BLOCK_L2 } from "../../app/consts/sort";

interface IProposerBlocksProps {
    proposer: string;
}

const ProposerBlocks = ({ proposer }: IProposerBlocksProps) => {
    const { t } = useTranslation();

    const [searchParams, setSearchParams] = useSearchParams();

    const page = getQueryParam(searchParams, "page", "1");
    const direction = getQueryParam(searchParams, "direction", "desc");
    const column = getQueryParam(searchParams, "column", "timeBlockL2");
    const badBlocks = getQueryParam(searchParams, "badBlocks", 0);

    const [sortDirection, setSortDirection] = useState<ISortDirection>({
        [BLOCK_NUMBER_L2]: column === BLOCK_NUMBER_L2 ? direction : "desc",
        [TIME_BLOCK_L2]: column === TIME_BLOCK_L2 ? direction : "desc",
    });

    const { isLoading, isError, error, data } = useProposerBlocksQuery({
        page,
        proposer,
        direction,
        column,
        badBlocks: Number(badBlocks),
    });

    const onPaginateChange = ({ selected }: IPageChange) => {
        setSearchParams({ page: String(selected + 1), direction, column, badBlocks });
    };

    const sortBy = (sortName: SortByTypes) => {
        const newSortDirection = sortDirection[sortName] === "asc" ? "desc" : "asc";

        setSortDirection({ ...sortDirection, [sortName]: newSortDirection });

        setSearchParams({ page, direction: newSortDirection, column: sortName, badBlocks });
    };

    const resetQuery = () => {
        for (const key of Array.from(searchParams.keys())) {
            searchParams.delete(key);
            setSearchParams(searchParams);
        }
    };

    const resetSort = () => {
        setSortDirection({
            [BLOCK_NUMBER_L2]: "desc",
            [TIME_BLOCK_L2]: "desc",
        });
    };

    const setBadBlocksW = (value: string) => {
        resetQuery();
        resetSort();

        setSearchParams({ badBlocks: String(value === "bad" ? 1 : 0) });
    };

    return (
        <div className="container mx-auto mt-16 max-w-7xl w-11/12 xl:w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 justify-items-left">
                <div className="flex justify-between mb-4">
                    <h2 className="text-3xl font-semibold">{t("Blocks")}</h2>
                    <button className="btn-white px-3 py-4 h-0 md:hidden" onClick={() => sortBy("blockNumberL2")}>
                        <IconArrowDownBold className={classNames({ "rotate-180": sortDirection[BLOCK_NUMBER_L2] === "desc" })} />
                    </button>
                </div>
                <div className="mb-4">
                    <BlockSwitch blockType={Number(badBlocks)} setBadBlocks={(value: string) => setBadBlocksW(value)} />
                </div>
            </div>

            <div className="nf-table table-proposer mb-20">
                <table className="table-fixed">
                    <thead className="hidden w-full md:table-header-group">
                        <tr>
                            <th onClick={() => sortBy("blockNumberL2")}>
                                {t("Block")}
                                <IconArrowDownBold
                                    className={classNames("inline align-baseline ml-2", {
                                        "rotate-180": sortDirection[BLOCK_NUMBER_L2] === "desc",
                                    })}
                                />
                            </th>
                            <th>{t("Block Hash")}</th>
                            <th>{t("Number of Transactions")}</th>
                            <th onClick={() => sortBy("timeBlockL2")}>
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
                        <TableBlocks isLoading={isLoading} data={data} isError={isError} error={error} challengedBlocks={Number(badBlocks) === 1} />
                    </tbody>
                    {!isLoading && !isError && data.totalPages > 1 && (
                        <tfoot className="table w-full md:contents">
                            <tr>
                                <td colSpan={4} className="p-3 text-center">
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

export default ProposerBlocks;
