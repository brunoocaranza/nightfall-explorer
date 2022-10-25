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
  projectFolderName: "frontend",
  nodejs: "16",
  hostname: process.env.FRONTEND_HOSTNAME || "client",
  bucketName: `${process.env.ENV_NAME}-${process.env.APP_NAME}`.toLowerCase(),
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
  },
};
