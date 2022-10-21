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

import "./ChallengedBlockProposers.scss";

const ChallengedBlockProposers = () => {
    const { t } = useTranslation();

    const [searchParams, setSearchParams] = useSearchParams();

    const page = getQueryParam(searchParams, "page", "1");
    const direction = getQueryParam(searchParams, "direction", "desc");
    const column = getQueryParam(searchParams, "column", "goodBlocks");

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

    const sortBy = (sortName: string) => {
        setSearchParams({ page, direction: direction === "asc" ? "desc" : "asc", column: sortName });
    };

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
                        className="react-select-container"
                        classNamePrefix="react-select"
                        isOptionDisabled={() => proposer.length >= 10}
                    />
                </div>
            </div>

            <div className="nf-table table-cb-proposers mb-20">
                <table className="table-fixed">
                    <thead className="hidden w-full md:table-header-group">
                        <tr>
                            <th>{t("#")}</th>
                            <th>{t("Proposer Address")}</th>
                            <th onClick={() => sortBy("goodBlocks")} className="cursor-pointer">
                                {t("Good Blocks")}
                                <IconArrowDownBold
                                    className={classNames("inline align-baseline ml-2", {
                                        "rotate-180": direction === "desc",
                                    })}
                                />
                            </th>
                            <th onClick={() => sortBy("badBlocks")} className="cursor-pointer">
                                {t("Bad Blocks")}
                                <IconArrowDownBold
                                    className={classNames("inline align-baseline ml-2", {
                                        "rotate-180": direction === "desc",
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
