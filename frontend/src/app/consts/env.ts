export type ENVType = {
    APP_NAME: string | undefined;
    APP_URL: string | undefined;
    API_URL: string | undefined;
    NET_URLS: string | undefined;
    SENTRY_DSN: string | undefined;
    L1_EXPLORER_URL: string | undefined;
};

export type ENVTypeNames = keyof ENVType;
