import { ServiceConfig } from "../iconfig";

export const explorerApiPrivate: ServiceConfig = {
  projectFolderName: "backend",
  hostname: process.env.API_PRIVATE_HOSTNAME || "",
  port: process.env.API_PRIVATE_TARGET_PORT
    ? +process.env.API_PRIVATE_TARGET_PORT
    : 80,
  privateNode: true,
  logGroup: process.env.API_PRIVATE_LOG_GROUP || "log-api",
  taskDefinition: {
    cpu: process.env.API_PRIVATE_TASK_CPU
      ? +process.env.API_PRIVATE_TASK_CPU
      : 256,
    memoryLimitMiB: process.env.API_PRIVATE_TASK_MEMORY
      ? +process.env.API_PRIVATE_TASK_MEMORY
      : 512,
  },
  targetGroup: {
    pathPatterns: ["/api/*"],
    priority: 1,
    healthcheck: {
      path: "/health",
    },
  },
  autoScaling: {
    minCapacity: process.env.API_PRIVATE_AUTOSCALING_MIN_CAPACITY
      ? +process.env.API_PRIVATE_AUTOSCALING_MIN_CAPACITY
      : 1,
    maxCapacity: process.env.API_PRIVATE_AUTOSCALING_MAX_CAPACITY
      ? +process.env.API_PRIVATE_AUTOSCALING_MAX_CAPACITY
      : 2,
    cpuUtilization: {
      target: process.env.API_PRIVATE_AUTOSCALING_CPU_UTILIZATION
        ? +process.env.API_PRIVATE_AUTOSCALING_CPU_UTILIZATION
        : 50,
    },
  },
  ecr: {
    repositoryName: process.env.API_ECR_REPOSITORY!,
    tag: "latest",
  },
  env: {
    NODE_ENV: "Private",
    PORT: process.env.API_PORT || "80",
    HOST: `${process.env.API_HOSTNAME}.${process.env.DNS_ZONE_NAME}}`,
    MONGODB_HOST: process.env.API_MONGODB_HOST || "localhost",
    MONGODB_PORT: process.env.API_MONGODB_PORT || "27017",
    MONGODB_DATABASE_NAME: process.env.API_DATABSE_NAME || "optimist-data",
    BLOCKCHAIN_URL: `${process.env.BLOCKCHAIN_URL}`,
    CLOUDWATCH_GROUP_NAME: `${process.env.API_PRIVATE_LOG_GROUP}-${process.env.ENV_NAME}`,
    THROTTLE_TTL: "60",
    THROTTLE_LIMIT: "30",
    NIGHTFALL_OPTIMIST_URL: process.env.NIGHTFALL_OPTIMIST_URL,
    NIGHTFALL_DASHBOARD_URL: process.env.NIGHTFALL_DASHBOARD_URL,
    EXPLORER_SYNC_URL: `https://${process.env.SYNC_HOSTNAME}.${process.env.DNS_ZONE_NAME}`,
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
