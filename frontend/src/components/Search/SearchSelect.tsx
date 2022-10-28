import { ISearchResponse, ISearchValue } from "../../app/query/useSearchMutation";
import React, { useEffect, useRef, useState } from "react";
import { useKeyPress } from "../../app/hooks/useKeyPress";
import classNames from "classnames";
import { useTranslation } from "react-i18next";

interface ISearchSelect {
    data: ISearchResponse | any;
    submittedTerm: string;
    searchSelected: (item: ISearchValue) => void;
}

interface ITypeName {
    block_l1: string;
    block: string;
    transaction: string;
    proposer: string;
    challenged_block: string;
    challenged_block_l1: string;
}

const SearchSelect = ({ data, searchSelected, submittedTerm }: ISearchSelect) => {
    const { t } = useTranslation();

    const enterPress = useKeyPress("Enter");
    const downPress = useKeyPress("ArrowDown");
    const upPress = useKeyPress("ArrowUp");
    const multipleRef = useRef(null);
    const [cursor, setCursor] = useState<number>(0);

    const typeName: ITypeName = {
        block_l1: t("ETH Block"),
        block: t("Nightfall Block"),
        challenged_block: t("Nightfall Bad Block"),
        challenged_block_l1: t("ETH Bad Block"),
        transaction: "",
        proposer: "",
    };

    useEffect(() => {
        if (downPress && cursor < data.length - 1) {
            setCursor(cursor + 1);
        }
    }, [downPress]);

    useEffect(() => {
        if (upPress && cursor > 0) {
            setCursor(cursor - 1);
        }
    }, [upPress]);

    useEffect(() => {
        if (enterPress) {
            searchSelected(data[cursor]);
        }
    }, [enterPress]);

    return (
        <div className="bg-white relative rounded-xl z-10 p-2 border border-gray-100" ref={multipleRef}>
            {data.map((item: ISearchValue, index: number) => {
                return (
                    <div
                        key={index}
                        onClick={() => searchSelected(item)}
                        className={classNames("hover:bg-gray-100 flex items-center cursor-pointer rounded-2xl px-3 py-2 font-bold", {
                            "bg-gray-100": cursor === index,
                        })}
                    >
                        <div className="bg-primary-400 p-2 text-white text-xs mr-3 rounded-xl">{typeName[item.type]}</div>
                        {submittedTerm}
                    </div>
                );
            })}
        </div>
    );
};

export default SearchSelect;
