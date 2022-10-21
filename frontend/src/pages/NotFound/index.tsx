import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import IconArrowLeft from "jsx:../../assets/images/icons/arrow-left.svg";

const NotFound = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="container mx-auto py-32 max-w-7xl w-11/12 xl:w-full">
            <div className="h-[calc(100vh-200px)]">
                <p className="text-primary-500 mb-4">{t("404 Error")}</p>

                <div className="max-w-xl mb-10">
                    <h1 className="text-6xl mb-6">{t("We lost that page...")}</h1>
                    <p className="text-xl font-normal text-gray-400">{t("Sorry, the page you’re looking for doesn’t exist or has been removed.")}</p>
                </div>

                <div className="btn-group">
                    <button onClick={() => navigate(-2)} className="btn-light">
                        <IconArrowLeft />

                        {t("Go back")}
                    </button>
                    <Link to="/" className="btn btn-primary">
                        {t("Back to Block Explorer")}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
