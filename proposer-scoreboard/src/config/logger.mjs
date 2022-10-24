import * as winston from "winston";
import { loggerEnv, server } from "./constants.mjs";

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

const cloudTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.printf((info) => {
      return `${info.timestamp} [${info.level}] ${info.message}`;
    })
  ),
});

const createLogger = () => {
  const env = server.env;
  const level = loggerEnv.logLevel;

  loggerInstance = winston.createLogger({
    levels: winston.config.npm.levels,
    level,
  });

  if (env !== "local") {
    loggerInstance.add(cloudTransport);
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
