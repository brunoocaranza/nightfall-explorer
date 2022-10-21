import { useState } from "react";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import "./BlockSwitch.scss";

interface IBlockSwitchProps {
    setBadBlocks: (value: BlockTypes) => void;
    blockType: number;
}

type BlockTypes = "good" | "bad";

const BlockSwitch = ({ setBadBlocks, blockType }: IBlockSwitchProps) => {
    const { t } = useTranslation();

    const [block, setBlock] = useState<BlockTypes>(blockType === 0 ? "good" : "bad");

    const setBlockW = (type: BlockTypes) => {
        setBlock(type);
        setBadBlocks(type);
    };

    return (
        <div className="switchWrapper flex items-center">
            <div
                onClick={() => setBlockW("good")}
                className={classNames("choice", {
                    active: block === "good",
                })}
            >
                {t("Good Blocks")}
            </div>
            <div
                onClick={() => setBlockW("bad")}
                className={classNames("choice", {
                    active: block === "bad",
                })}
            >
                {t("Bad Blocks")}
            </div>
        </div>
    );
};

export default BlockSwitch;
