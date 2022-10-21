import { ServiceConfig } from "../iconfig";

export const frontend: ServiceConfig = {
  hostname: process.env.FRONTEND_HOSTNAME || "client",
  cloudfront: {
    hostname: process.env.FRONTEND_CLOUDFRONT_HOSTNAME || "explorer",
  },
  port: process.env.FRONTEND_TARGET_PORT
    ? +process.env.FRONTEND_TARGET_PORT
    : 80,
  logGroup: process.env.FRONTEND_LOG_GROUP || "log-frontend",
  taskDefinition: {
    cpu: process.env.FRONTEND_TASK_CPU ? +process.env.FRONTEND_TASK_CPU : 256,
    memoryLimitMiB: process.env.FRONTEND_TASK_MEMORY
      ? +process.env.FRONTEND_TASK_MEMORY
      : 512,
  },
  targetGroup: {
    pathPatterns: ["/*"],
    priority: 2,
    healthcheck: {
      path: "/",
    },
  },
  ecr: {
    repositoryName: process.env.FRONTEND_REPOSITORY!,
    tag: "latest",
  },
  git: {
    repository: process.env.FRONTEND_REPOSITORY!,
  },
  env: {
    APP_NAME: process.env.FRONTEND_APP_NAME || "Nightfall Explorer",
    APP_URL: `https://${process.env.FRONTEND_HOSTNAME}.${process.env.DNS_ZONE_NAME}`,
    API_URL: `https://${process.env.API_HOSTNAME}.${process.env.DNS_ZONE_NAME}/api/v1`,
    URL_SHIELD_CONTRACT: `${process.env.URL_SHIELD_CONTRACT}`,
    URL_STATE_CONTRACT: `${process.env.URL_STATE_CONTRACT}`,
    NET_URLS: `${process.env.FRONTEND_NET_URLS}`,
    L1_EXPLORER_URL: `${process.env.L1_EXPLORER_URL}`,
  },
};
