import { useState } from "react";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import Select from "react-select";
import { useChallengedBlocksQuery } from "../../app/query/block/useChallengedBlocksQuery";
import TableProposers from "./TableProposers";
import { Pagination } from "../Pagination";
import { IPageChange } from "../../app/consts/page";
import { useSearchParams } from "react-router-dom";
import { getQueryParam } from "../../app/utils/helpers";
import { useProposerListQuery } from "../../app/query/proposer/useProposerListQuery";
import IconArrowDownBold from "jsx:../../assets/images/icons/arrow-down-bold.svg";
import { BAD_BLOCKS, BLOCK_NUMBER_L2, GOOD_BLOCKS, ISortDirectionProposer, SortByProposerTypes } from "../../app/consts/sort";

import "./ChallengedBlockProposers.scss";

const ChallengedBlockProposers = () => {
    const { t } = useTranslation();

    const [searchParams, setSearchParams] = useSearchParams();

    const page = getQueryParam(searchParams, "page", "1");
    const direction = getQueryParam(searchParams, "direction", "desc");
    const column = getQueryParam(searchParams, "column", GOOD_BLOCKS);

    const [sortDirection, setSortDirection] = useState<ISortDirectionProposer>({
        [GOOD_BLOCKS]: column === GOOD_BLOCKS ? direction : "desc",
        [BAD_BLOCKS]: column === BAD_BLOCKS ? direction : "desc",
    });

    const [proposer, setProposer] = useState([]);

    const { isLoading, isError, error, data } = useChallengedBlocksQuery({
        page,
        proposer: proposer.map((item: any) => item.value).join(","),
        direction,
        column,
    });

    const { data: proposers } = useProposerListQuery();

    const onPaginateChange = ({ selected }: IPageChange) => {
        setSearchParams({ page: String(selected + 1), direction, column });
    };

    const sortBy = (sortName: SortByProposerTypes) => {
        const newSortDirection = sortDirection[sortName] === "asc" ? "desc" : "asc";

        setSortDirection({ ...sortDirection, [sortName]: newSortDirection });

        setSearchParams({ page, direction: newSortDirection, column: sortName });
    };

    const sortByMd = (sortName: SortByProposerTypes, newSortDirection: string) => {
        setSortDirection({ ...sortDirection, [sortName]: newSortDirection });

        setSearchParams({ page, direction: newSortDirection, column: sortName });
    };

    const Labels = {
        [GOOD_BLOCKS]: t("Good Blocks"),
        [BAD_BLOCKS]: t("Bad Blocks"),
    };

    const sortList: Array<{ value: string; label: string }> = [
        {
            value: GOOD_BLOCKS,
            label: Labels[GOOD_BLOCKS],
        },
        {
            value: BAD_BLOCKS,
            label: Labels[BAD_BLOCKS],
        },
    ];

    return (
        <div>
            <div className="grid">
                <div className="justify-self-end mb-6 w-full sm:w-auto">
                    <Select
                        options={proposers}
                        value={proposer}
                        onChange={(items: any) => setProposer(items)}
                        placeholder={t("Filter by proposer")}
                        isMulti
                        classNamePrefix="gray-small-select"
                        isOptionDisabled={() => proposer.length >= 10}
                    />
                </div>
            </div>

            <div className="flex justify-between mb-4">
                <div className="w-48 md:hidden">
                    <Select
                        options={sortList}
                        value={{ label: Labels[column], value: column }}
                        onChange={(selectedItem: any) => {
                            sortByMd(selectedItem.value, direction);
                        }}
                        isSearchable={false}
                        classNamePrefix="classic-select"
                        placeholder={t("Sort by")}
                    />
                </div>
                <button
                    aria-label={t("Sort ASC/DESC")}
                    className="btn-white px-3 py-4 h-0 md:hidden"
                    onClick={() => sortByMd(column, direction === "asc" ? "desc" : "asc")}
                >
                    <IconArrowDownBold className={classNames({ "rotate-180": direction === "desc" })} />
                </button>
            </div>

            <div className="nf-table table-cb-proposers mb-20">
                <table className="table-fixed">
                    <thead className="hidden w-full md:table-header-group">
                        <tr>
                            <th>{t("#")}</th>
                            <th>{t("Proposer Address")}</th>
                            <th onClick={() => sortBy(GOOD_BLOCKS)} className="cursor-pointer">
                                {t("Good Blocks")}
                                <IconArrowDownBold
                                    className={classNames("inline align-baseline ml-2", {
                                        "rotate-180": sortDirection[GOOD_BLOCKS] === "desc",
                                    })}
                                />
                            </th>
                            <th onClick={() => sortBy(BAD_BLOCKS)} className="cursor-pointer">
                                {t("Bad Blocks")}
                                <IconArrowDownBold
                                    className={classNames("inline align-baseline ml-2", {
                                        "rotate-180": sortDirection[BAD_BLOCKS] === "desc",
                                    })}
                                />
                            </th>
                            <th>{t("Stake Amount")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <TableProposers data={data} isLoading={isLoading} isError={isError} error={error} page={Number(page)} />
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

export default ChallengedBlockProposers;
