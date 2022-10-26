import { ENVType, ENVTypeNames } from "../consts/env";
import moment from "moment/moment";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import { RefObject } from "react";

const LIMIT_PER_PAGE = 10;

const init = () => {
    // Sentry.init({
    //     dsn: env("SENTRY_DSN"),
    //     integrations: [new BrowserTracing()],
    //     tracesSampleRate: 1.0,
    // });
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

const env = (variable: ENVTypeNames): string => {
    const envs: ENVType = {
        APP_NAME: process.env.APP_NAME,
        APP_URL: process.env.APP_URL,
        API_URL: process.env.API_URL,
        NET_URLS: process.env.NET_URLS,
        SENTRY_DSN: process.env.SENTRY_DSN,
        L1_EXPLORER_URL: process.env.L1_EXPLORER_URL,
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

export { init, reduceHash, LIMIT_PER_PAGE, getQueryParam, replacePath, env, convertTimestampToUTC, scrollToRef, redirectPath };
