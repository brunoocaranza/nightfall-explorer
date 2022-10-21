import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { ChallengedBlockTabs } from "../../app/consts/block";

import "../Swich/BlockSwitch.scss";

interface IChallengedBlockSwitchProps {
    changeTab: (tab: ChallengedBlockTabs) => void;
    activeTab: ChallengedBlockTabs;
}

const ChallengedBlockSwitch = ({ changeTab, activeTab }: IChallengedBlockSwitchProps) => {
    const { t } = useTranslation();

    return (
        <>
            <div className="flex flex-wrap items-center md:float-right">
                <div className="items-end flex-col w-full">
                    <div className="switchWrapper flex">
                        <div
                            onClick={() => changeTab("challenged-blocks")}
                            className={classNames("choice", {
                                active: activeTab === "challenged-blocks",
                            })}
                        >
                            {t("Challenged Blocks")}
                        </div>
                        <div
                            onClick={() => changeTab("proposers")}
                            className={classNames("choice", {
                                active: activeTab === "proposers",
                            })}
                        >
                            {t("Proposers")}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChallengedBlockSwitch;
