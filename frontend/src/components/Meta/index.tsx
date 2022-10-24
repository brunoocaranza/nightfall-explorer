import i18next from "i18next";
import { Helmet } from "react-helmet-async";
import { env } from "../../app/utils/helpers";
import { useTranslation } from "react-i18next";
import { metaData } from "../../app/utils/meta";
import { useLocation } from "react-router-dom";
import { ChildrenProp } from "../../app/consts/props";

const Meta = ({ children }: ChildrenProp) => {
    const { t } = useTranslation();
    const location = useLocation();

    const item = metaData(location.pathname);

    const helmet = () => {
        return (
            <Helmet>
                <title>{t(item.title)}</title>
                <meta name="description" content={t(item.description)} />
                <meta name="title" content={t(item.title)} />
                <meta name="site_name" content={env("APP_NAME")} />

                <meta property="og:title" content={t(item.title)} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={env("APP_URL")} />
                <meta property="og:site_name" content={env("APP_NAME")} />
                <meta property="og:description" content={t(item.description)} />
                <meta property="og:locale" content={i18next.language} />

                <meta name="robots" content="index, follow" />
                <link rel="canonical" href={env("APP_URL")} />
            </Helmet>
        );
    };

    return (
        <>
            {helmet()}
            {children}
        </>
    );
};

export default Meta;
