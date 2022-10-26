import { useTranslation } from "react-i18next";
import IconDown from "jsx:../../assets/images/icons/chevron-down.svg";

interface IShowMoreButton {
    value: boolean;
    onClick: () => void;
    className: string;
}

const ShowMoreButton = ({ value, className, ...props }: IShowMoreButton) => {
    const { t } = useTranslation();

    return (
        <button
            aria-label={value ? t("Show less") : t("Show more")}
            className={`bg-white hover:bg-gray-25 rounded-xl border border-gray-100 mt-6 flex items-center ${className}`}
            {...props}
        >
            {value ? (
                <>
                    {t("Show less")} <IconDown className="ml-3 rotate-180" />
                </>
            ) : (
                <>
                    {t("Show more")} <IconDown className="ml-3" />
                </>
            )}
        </button>
    );
};

export default ShowMoreButton;
