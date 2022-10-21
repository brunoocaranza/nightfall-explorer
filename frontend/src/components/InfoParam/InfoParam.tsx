import { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Tooltip from "../Tooltip";
import IconCopy from "jsx:../../assets/images/icons/copy.svg";

interface IInfoParamProps {
    title?: string;
    value?: string | number | Array<string>;
    valueInfo?: string;
    linkUrl?: string;
    linkText?: string;
    valueIcon?: ReactNode;
    allowCopy?: boolean;
    prefix?: string | ReactNode;
    sufix?: string;
}

const InfoParam = ({ title, value, linkUrl, linkText, allowCopy, prefix, sufix, valueInfo }: IInfoParamProps) => {
    const { t } = useTranslation();
    const [copyTitle, setCopyTitle] = useState<string>(t("Copy address to clipboard"));

    const getValue = () => {
        if (typeof value === "object" && value.length > 1) {
            return <div className="truncate max-h-24 whitespace-pre-line overflow-y-auto text-left lg:text-right">{value.join("\n")} </div>;
        }

        if (linkUrl && linkText) {
            return (
                <a href={linkUrl} className="text-primary-400" target="_blank" rel="noreferrer">
                    {linkText}
                </a>
            );
        }

        return <span className="truncate whitespace-pre-line max-w-2xl"> {value} </span>;
    };

    const copied = () => {
        setCopyTitle(t("Copied!"));

        setTimeout(() => {
            setCopyTitle(t("Copy address to clipboard"));
        }, 3000);
    };

    return (
        <div className="flex flex-col lg:flex-row justify-between relative border-b border-gray-100 py-8 px-5">
            <div className="font-light">{title}</div>

            <div>
                <div
                    className={classNames("flex items-end justify-end font-bold border-b border-transparent transition-all border-b-4", {
                        "hover:text-primary-500 hover:cursor-pointer hover:border-b-primary hover:border-opacity-40": allowCopy,
                    })}
                >
                    {prefix && <span className="mr-2">{prefix}</span>}
                    {getValue()}

                    {allowCopy && (
                        <CopyToClipboard text={String(value)} onCopy={() => copied()}>
                            <div>
                                <Tooltip message={copyTitle}>
                                    <IconCopy className="ml-2 mb-1.5" />
                                </Tooltip>
                            </div>
                        </CopyToClipboard>
                    )}
                    {sufix && <span className="ml-2">{sufix}</span>}
                </div>
                {valueInfo && <div className="bg-blue-100 text-blue-600 rounded-lg text-sm py-1 px-2 float-right">{valueInfo}</div>}
            </div>
        </div>
    );
};
export default InfoParam;
