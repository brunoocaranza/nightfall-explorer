import routeList from "../router";
import { LANDING_PAGE, NOT_FOUND_PAGE, RouteMeta } from "../router/consts";

const getPage = (pathname: string) => {
    const paths = pathname.split("/");

    const pagePath = paths[1] != "" ? paths[1] : LANDING_PAGE;
    const pageParams = paths[paths.length - 1];

    let pageName = Object.keys(routeList).find((item) => item === pagePath);

    if (!pageName || pageParams === NOT_FOUND_PAGE) {
        pageName = NOT_FOUND_PAGE;
    }

    return { pageName, pageParams };
};

export const metaData = (pathname: string): RouteMeta => {
    const { pageName, pageParams } = getPage(pathname);

    const meta = routeList[pageName].meta;

    const title = meta.title.replace("{PARAM}", pageParams);
    const description = meta.description.replace("{PARAM}", pageParams);

    return { title, description };
};
