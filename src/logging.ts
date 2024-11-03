import winston from "winston";
import fs from "fs";

const logDir = "/home/logs";

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
        filename: `${logDir}/server.log`,
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
