import { ServiceConfig } from "../iconfig";

export const syncService: ServiceConfig = {
  hostname: process.env.SYNC_HOSTNAME || "sync",
  port: 80,
  privateNode: true,
  logGroup: process.env.SYNC_LOG_GROUP || "log-sync",
  taskDefinition: {
    cpu: 1024,
    memoryLimitMiB: 2048,
  },
  targetGroup: {
    pathPatterns: ["/*"],
    priority: 1,
    healthcheck: {
      path: "/health",
    },
  },
  ecr: {
    repositoryName: process.env.SYNC_REPOSITORY!,
    tag: "latest",
  },
  git: {
    repository: process.env.SYNC_REPOSITORY!,
  },
  env: {
    NODE_ENV: process.env.ENV_NAME,
    PORT: "80",
    BLOCKCHAIN_WS: process.env.BLOCKCHAIN_URL,
    MONGODB_URL: `${process.env.API_MONGODB_HOST}:${process.env.API_MONGODB_PORT}/?retryWrites=false`,
    DATABASE_NAME: process.env.API_DATABSE_NAME,
    NIGHTFALL_OPTIMIST_URL:
      process.env.NIGHTFALL_OPTIMIST_URL || "http://localhost:8081",
    CLOUDWATCH_GROUP_NAME: `${process.env.SYNC_LOG_GROUP}-${process.env.ENV_NAME}`,
  },
  secretVars: [
    {
      envName: "MONGODB_PASSWORD",
      type: "secureString",
      parameterName: "mongo_password",
    },
    {
      envName: "MONGODB_USER",
      type: "string",
      parameterName: "mongo_user",
    },
  ],
};
