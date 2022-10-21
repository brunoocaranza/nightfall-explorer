import { useTranslation } from "react-i18next";
import { IStats } from "../../app/consts/proposer";
import IconBlocks from "jsx:../../assets/images/icons/blocks.svg";
import IconChallengedBlocks from "jsx:../../assets/images/icons/proposer-challenged-blocks.svg";
import IconGoodBlocks from "jsx:../../assets/images/icons/good-blocks.svg";
import IconBadBlocks from "jsx:../../assets/images/icons/bad-blocks.svg";

interface IStatisticBlockProps {
    stats: IStats;
}

const StatisticBlock = ({ stats }: IStatisticBlockProps) => {
    const { t } = useTranslation();

    const { blocks, goodBlocks, badBlocks, challengedBlocks } = stats;

    return (
        <div className="bg-gray-50 pb-14 xl:pb-28 xl:mb-32">
            <div className="container mx-auto left-0 right-0 xl:absolute">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                    <div className="mx-4 p-4 rounded-xl bg-white shadow-[0_18px_32px_rgba(18,24,46,0.15)] md:mx-0">
                        <div className="flex items-center">
                            <div className="ml-4">
                                <div className="bg-primary-300 w-24 h-24 flex justify-center items-center rounded-full">
                                    <IconBlocks />
                                </div>
                            </div>
                            <div className="ml-4">
                                <strong className="text-3xl block text-black">{blocks}</strong>
                                <span className="text-gray-500 font-light text-sm">{t("Total Blocks")}</span>
                            </div>
                        </div>
                    </div>
                    <div className="mx-4 p-4 rounded-xl bg-white shadow-[0_18px_32px_rgba(18,24,46,0.15)] md:mx-0">
                        <div className="flex items-center">
                            <div className="ml-4">
                                <div className="bg-primary-300 w-24 h-24  flex justify-center items-center rounded-full">
                                    <IconGoodBlocks />
                                </div>
                            </div>
                            <div className="ml-4">
                                <strong className="text-3xl block text-black">{goodBlocks}</strong>
                                <span className="text-gray-500 font-light text-sm">{t("Good Blocks")}</span>
                            </div>
                        </div>
                    </div>
                    <div className="mx-4 p-4 rounded-xl bg-white shadow-[0_18px_32px_rgba(18,24,46,0.15)] md:mx-0">
                        <div className="flex items-center">
                            <div className="ml-4">
                                <div className="bg-primary-300 w-24 h-24  flex justify-center items-center rounded-full">
                                    <IconBadBlocks />
                                </div>
                            </div>
                            <div className="ml-4">
                                <strong className="text-3xl block text-black">{badBlocks}</strong>
                                <span className="text-gray-500 font-light text-sm">{t("Bad Blocks")}</span>
                            </div>
                        </div>
                    </div>
                    <div className="mx-4 p-4 rounded-xl bg-white shadow-[0_18px_32px_rgba(18,24,46,0.15)] md:mx-0">
                        <div className="flex items-center">
                            <div className="ml-4">
                                <div className="bg-primary-300 w-24 h-24  flex justify-center items-center rounded-full">
                                    <IconChallengedBlocks />
                                </div>
                            </div>
                            <div className="ml-4">
                                <strong className="text-3xl block text-black">{challengedBlocks}</strong>
                                <span className="text-gray-500 font-light text-sm">{t("Current number of challenged blocks")}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatisticBlock;
