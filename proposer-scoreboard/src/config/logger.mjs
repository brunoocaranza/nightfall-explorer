import * as winston from "winston";
import WinstonCloudwatch from "winston-cloudwatch";
import { loggerEnv, server } from "./constants.mjs";
import { v4 as uuidv4 } from "uuid";

const LogLevels = {
  INFO: "info",
  DEBUG: "debug",
  WARN: "warn",
  ERROR: "error",
  VERBOSE: "verbose",
};

const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.colorize({
      colors: {
        info: "cyan",
        debug: "blue",
        error: "red",
        warn: "yellow",
      },
    }),
    winston.format.printf((info) => {
      return `${info.timestamp} [${info.level}] ${info.message}`;
    })
  ),
});

const cloudWatchTransport = (env) => {
  return new WinstonCloudwatch({
    name: `Nighfall explorer logs - ${env}`,
    logGroupName: `${loggerEnv.groupName}`,
    logStreamName: uuidv4(),
    messageFormatter: (item) => {
      return ` [${item.level}] ${item.message}`;
    },
    errorHandler: (err) => {
      console.error("Cloud watch error: ", err);
    },
  });
};

const createLogger = () => {
  const env = server.env;
  const level = loggerEnv.logLevel;

  loggerInstance = winston.createLogger({
    levels: winston.config.npm.levels,
    level,
  });

  if (env !== "local") {
    loggerInstance.add(cloudWatchTransport(env));
  } else loggerInstance.add(consoleTransport);
};

let loggerInstance = undefined;

const logger = () => {
  if (!loggerInstance) {
    createLogger();
  }
  return {
    info(message) {
      loggerInstance.log(LogLevels.INFO, { message });
    },
    error(message) {
      loggerInstance.error(LogLevels.ERROR, { message });
    },
    warn(message) {
      loggerInstance.warn(LogLevels.WARN, { message });
    },
    debug(message) {
      loggerInstance.debug(LogLevels.DEBUG, { message });
    },
    verbose(message) {
      loggerInstance.verbose(LogLevels.VERBOSE, { message });
    },
  };
};
export default logger();
