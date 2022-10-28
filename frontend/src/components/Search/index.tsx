import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import { ISearchValue, useSearchMutation } from "../../app/query/useSearchMutation";
import routeList from "../../app/router";
import { SEARCH_NOT_FOUND } from "../../app/router/consts";
import { ResourceName, resourceNames } from "../../app/consts/resources";
import { redirectPath } from "../../app/utils/helpers";
import SearchSelect from "./SearchSelect";
import IconSearch from "jsx:../../assets/images/icons/search.svg";
import IconSearchWhite from "jsx:../../assets/images/icons/search-white.svg";
import IconDanger from "jsx:../../assets/images/icons/danger.svg";
import IconLoading from "jsx:../../assets/images/icons/loader.svg";

import "./Search.scss";

interface ISearchProps {
    miniForm?: boolean;
}

const Search = ({ miniForm }: ISearchProps) => {
    const [term, setTerm] = useState<string>("");
    const [submittedTerm, setSubmittedTerm] = useState<string>("");
    const [isValid, setIsValid] = useState<boolean>(true);

    const navigate = useNavigate();
    const { t } = useTranslation();

    const { mutate, isLoading, isSuccess, isError, data, error } = useSearchMutation(term);

    const isMultiple = data && data.length > 1;

    const onSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();

        if (term.trim() === "") {
            setIsValid(false);
        } else {
            setSubmittedTerm(term);

            mutate();
        }
    };

    useEffect(() => {
        setIsValid(true);
    }, [term]);

    useEffect(() => {
        if (data) {
            const isDataArray = Array.isArray(data);

            if ((isDataArray && data.length === 1) || !isDataArray) {
                const { value, type } = (isDataArray ? data[0] : data) as ISearchValue;

                navigate(redirectPath(routeList[resourceNames[type]].path, value, isChallenged(type)));
            }
        }

        if (error) {
            navigate(redirectPath(routeList[SEARCH_NOT_FOUND].path, term));
        }
    }, [isSuccess, isError]);

    const isChallenged = (type: ResourceName) => {
        return type === "challenged_block" || type === "challenged_block_l1";
    };

    const searchSelected = (item: ISearchValue) => {
        navigate(redirectPath(routeList[resourceNames[item.type]].path, item.value, isChallenged(item.type)));
    };

    return (
        <form
            onSubmit={onSubmit}
            className={classNames("search-input container mx-auto max-w-7xl relative mt-[-42] h-16 md:h-20 rounded-xl md:w-11/12 xl:w-full", {
                "search-input__mini h-14": miniForm,
            })}
        >
            <IconSearch className="hidden md:block absolute w-6 h-6 ml-7 mt-7" />
            <input
                type="text"
                name="search"
                id="search"
                value={term}
                autoComplete="off"
                onChange={(e) => setTerm(e.target.value)}
                placeholder={t("Search by tx hash / block number (both Nightfall & ETH), block hash, proposer address...")}
                className={classNames(
                    "w-full h-16 md:h-20 text-xl pl-6 md:pl-20 focus-visible:outline-none focus-visible:border-gray-200 pr-20 placeholder:overflow-ellipsis",
                    {
                        invalid: !isValid,
                        multiple: isMultiple,
                    }
                )}
            />
            {!isValid && (
                <div className="flex items-center mt-2 text-red-600">
                    <IconDanger className="mr-2 w-4" /> {t("Please enter value")}
                </div>
            )}
            {isMultiple && term === submittedTerm && (
                <SearchSelect data={data} submittedTerm={submittedTerm} searchSelected={(selected) => searchSelected(selected)} />
            )}

            <div className="absolute right-3 top-2 flex items-center">
                {isLoading && <IconLoading className="animate-spin mr-4" />}
                <button type="submit" className=" p-3 rounded-2xl bg-primary-500 text-white font-bold md:right-7 md:p-5">
                    <span className="hidden md:block">{t("Search")}</span>
                    <IconSearchWhite className="block md:hidden" />
                </button>
            </div>
        </form>
    );
};
export default Search;
