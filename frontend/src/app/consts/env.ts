export type ENVType = {
    APP_NAME: string;
    APP_URL: string;
    API_URL: string;
    NET_URLS: string;
    SENTRY_DSN: string;
    MATOMO_URL: string;
    MATOMO_SITE_ID: string;
    L1_EXPLORER_URL: string;
};

export type ENVTypeNames = keyof ENVType;
