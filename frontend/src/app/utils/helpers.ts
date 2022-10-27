import { RefObject } from "react";
import { ENVType, ENVTypeNames } from "../consts/env";
import moment from "moment/moment";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import { createInstance } from "@datapunt/matomo-tracker-react";

const LIMIT_PER_PAGE = 10;

const init = () => {
    if (env("SENTRY_DSN") !== "") {
        Sentry.init({
            dsn: env("SENTRY_DSN"),
            integrations: [new BrowserTracing()],
            tracesSampleRate: 1.0,
        });
    }
};

const matomoInstance = () => {
    if (env("MATOMO_URL") !== "" && env("MATOMO_SITE_ID") !== "") {
        return createInstance({
            urlBase: env("MATOMO_URL"),
            siteId: Number(env("MATOMO_SITE_ID")),
        });
    }

    return null;
};

const reduceHash = (hash: string): string => {
    return `${hash.substring(0, 10)}...${hash.slice(-8)}`;
};

const replacePath = (path: string, hash: string, hashName = ":hash"): string => {
    return path.replace(hashName, hash);
};

const getQueryParam = (object: any, name: string, defaultValue: unknown) => {
    return object.get(name) ?? defaultValue;
};

const redirectPath = (path: string, param: string, challenged: boolean | undefined = false) => {
    return `${replacePath(path, param)}${challenged ? "?challenged=1" : ""}`;
};

const replaceUndefined = (variable: string | undefined): string => {
    return variable !== undefined ? variable : "";
};

const env = (variable: ENVTypeNames): string => {
    const envs: ENVType = {
        APP_NAME: replaceUndefined(process.env.APP_NAME),
        APP_URL: replaceUndefined(process.env.APP_URL),
        API_URL: replaceUndefined(process.env.API_URL),
        NET_URLS: replaceUndefined(process.env.NET_URLS),
        SENTRY_DSN: replaceUndefined(process.env.SENTRY_DSN),
        L1_EXPLORER_URL: replaceUndefined(process.env.L1_EXPLORER_URL),
        MATOMO_URL: replaceUndefined(process.env.MATOMO_URL),
        MATOMO_SITE_ID: replaceUndefined(process.env.MATOMO_SITE_ID),
    };

    return envs[variable];
};

const convertTimestampToUTC = (datetime: string) => {
    return `${moment(datetime).fromNow()} (${moment(datetime).utc().format("MMM Do YYYY h:mm:ss A z")})`;
};

const scrollToRef = (ref: RefObject<HTMLDivElement>) => {
    if (ref.current) {
        window.scrollTo({
            top: ref.current.offsetTop - 15,
            left: 0,
            behavior: "smooth",
        });
    }
};

export { init, reduceHash, LIMIT_PER_PAGE, getQueryParam, replacePath, env, convertTimestampToUTC, scrollToRef, redirectPath, matomoInstance };
