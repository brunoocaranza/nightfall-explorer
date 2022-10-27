interface IENV {
    APP_URL: string;
    API_URL: string;
    NET_URLS: string;
    SENTRY_DSN: string;
    MATOMO_URL: string;
    MATOMO_SITE_ID: string;
    L1_EXPLORER_URL: string;
}

declare module "*.svg" {
    import React = require("react");
    const src: React.FC<React.SVGProps<SVGSVGElement>> | string | unefined;

    export default src;
}

declare module "*.png" {
    export default "" as string;
}

declare module "*.jpg" {
    export default "" as string;
}

declare module "*.gif" {
    export default "" as string;
}
