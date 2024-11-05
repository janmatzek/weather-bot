import winston from "winston";

const LOG_DIR = process.env.LOG_DIR || "./logs";

export function getLogger() {
  const logger = winston.createLogger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
          winston.format.align(),
          winston.format.printf(
            (info) => `${info.level}: ${[info.timestamp]}: ${info.message}`
          )
        ),
      }),
      new winston.transports.File({
        filename: `${LOG_DIR}/server.log`,
        format: winston.format.combine(
          winston.format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
          winston.format.align(),
          winston.format.printf(
            (info) => `${info.level}: ${[info.timestamp]}: ${info.message}`
          )
        ),
      }),
    ],
  });

  return logger;
}
