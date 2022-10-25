import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";
import Search from "../../components/Search";
import IconArrowLeft from "jsx:../../assets/images/icons/arrow-left.svg";

const SearchNotFound = () => {
    const { t } = useTranslation();
    const { hash } = useParams();
    const navigate = useNavigate();

    return (
        <div className="container py-32 mx-auto max-w-7xl w-11/12 xl:w-full">
            <p className="text-primary-500 mb-4">{t("Sorry")} </p>

            <div className="max-w-xl mb-10">
                <h1 className="text-6xl mb-6">{t("No results match the search term:")}</h1>
                <p className="text-xl font-normal text-gray-400">{hash}</p>
            </div>

            <div className="max-w-xl mb-10">
                <p className="mb-2">
                    <strong>{t("Try searching again...")}</strong>
                </p>
                <Search miniForm={true} />
            </div>

            <div className="btn-group">
                <button onClick={() => navigate(-1)} className="btn-light">
                    <IconArrowLeft />

                    {t("Go back")}
                </button>
                <Link to="/" className="btn btn-primary">
                    {t("Back to Block Explorer")}
                </Link>
            </div>
        </div>
    );
};

export default SearchNotFound;
