import ChallengedHeader from "../../components/ChallengedHeader";
import { useEffect, useState } from "react";
import { ChallengedBlockTabs } from "../../app/consts/block";
import ChallengedBlockSwitch from "../../components/ChallengedBlocks/ChallengedBlockSwitch";
import ChallengedBlockProposers from "../../components/ChallengedBlocks/ChallengedBlockProposers";
import ChallengedBlocks from "../../components/ChallengedBlocks/ChallengedBlocks";
import { useTranslation } from "react-i18next";
import Search from "../../components/Search";
import { useSearchParams } from "react-router-dom";

const ChallengedBlock = () => {
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    const [tab, setTab] = useState<ChallengedBlockTabs>("proposers"); // TODO challenged-blocks

    useEffect(() => {
        resetQuery();
    }, []);

    const resetQuery = () => {
        for (const key of Array.from(searchParams.keys())) {
            searchParams.delete(key);
            setSearchParams(searchParams);
        }
    };

    const onChangeTab = (tab: ChallengedBlockTabs) => {
        resetQuery();

        setTab(tab);
    };

    return (
        <>
            <ChallengedHeader />

            {tab === "challenged-blocks" && <Search />}

            <div className="container mx-auto mt-16 max-w-7xl w-11/12 xl:w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 justify-items-left">
                    <div className="mb-4">
                        <h2 className="mb-2 sm:mb-7 text-3xl font-semibold">
                            {tab === "challenged-blocks" && t("Latest Challenged Blocks")}
                            {tab === "proposers" && t("Proposers")}
                        </h2>
                    </div>
                    <div className="mb-4">
                        <ChallengedBlockSwitch activeTab={tab} changeTab={(tab: ChallengedBlockTabs) => onChangeTab(tab)} />
                    </div>
                </div>

                {tab === "challenged-blocks" && <ChallengedBlocks />}
                {tab === "proposers" && <ChallengedBlockProposers />}
            </div>
        </>
    );
};

export default ChallengedBlock;
