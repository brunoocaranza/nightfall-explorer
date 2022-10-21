export const nightfall = {
  blockchain_ws: process.env.BLOCKCHAIN_WS,
  nightfall_optimist_url: process.env.NIGHTFALL_OPTIMIST_URL,
};

export const database = {
  name: process.env.DATABASE_NAME,
  url: process.env.MONGODB_URL,
  user: process.env.MONGODB_USER,
  password: process.env.MONGODB_PASSWORD,
};

export const server = {
  port: process.env.PORT,
  env: process.env.NODE_ENV,
};

export const loggerEnv = {
  logLevel: process.env.LOG_LEVEL || "info",
  groupName: process.env.CLOUDWATCH_GROUP_NAME,
  streamName: process.env.CLOUDWATCH_STREAM_NAME,
};
