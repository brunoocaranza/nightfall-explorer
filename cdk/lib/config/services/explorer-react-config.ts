export interface FrontendEnvVars {
  [key: string]: {
    value: string | undefined;
  };
}

export interface FrontendS3Config {
  projectFolderName: string;
  bucketName: string;
  hostname: string;
  env: FrontendEnvVars;
  nodejs: string; //16.x.x, 16.17.0
}

export const frontend: FrontendS3Config = {
  projectFolderName: "frontend", // name of a folder where frontend is located inside of repo
  nodejs: process.env.FRONTEND_NODEJS_VERSION!,
  hostname: process.env.FRONTEND_HOSTNAME!,
  bucketName: process.env.FRONTEND_BUCKET_NAME!,
  env: {
    APP_NAME: {
      value: process.env.FRONTEND_APP_NAME,
    },
    APP_URL: {
      value: `https://${process.env.FRONTEND_HOSTNAME}.${process.env.DNS_ZONE_NAME}`,
    },
    API_URL: {
      value: `https://${process.env.API_HOSTNAME}.${process.env.DNS_ZONE_NAME}/api/v1`,
    },
    NET_URLS: {
      value: `${process.env.FRONTEND_NET_URLS}`,
    },
    L1_EXPLORER_URL: {
      value: `${process.env.L1_EXPLORER_URL}`,
    },
    MATOMO_URL: {
      value: `${process.env.MATOMO_URL}`,
    },
    MATOMO_SITE_ID: {
      value: `${process.env.MATOMO_SITE_ID}`,
    },
  },
};
