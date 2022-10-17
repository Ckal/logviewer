const { createLogger, format, transports } = require("winston");
const winston = require("winston");

const customFormat = format.combine(
  format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
  format.align(),
  format.printf((i) => `{${i.level}: ${[i.timestamp]}: ${i.message}}`)
);

const onlineFormat = format.combine(
  format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
  format.align(),
  format.printf((i) => `{${i.message}}`)
);

const usersLogger = createLogger({
  transports: [
    new transports.File({
      filename: "logs/usersLog.log",
      format: customFormat,
    }),
    new transports.Console({
      format: customFormat,
    }),
  ],
});

const onlineLogger = createLogger({
  transports: [
    new transports.File({
      filename: "logs/onlineLog.log",
      format: onlineFormat,
    }),
    new transports.Console({
      format: onlineFormat,
    }),
  ],
});

const appLogger = createLogger({
  transports: [
    new transports.File({
      filename: "logs/appLog.log",
      format: customFormat,
      json: true,
      stringify: (obj) => JSON.stringify(obj),
    }),
    new transports.Console({
      format: customFormat,
    }),
  ],
});

module.exports = {
  usersLogger: usersLogger,
  onlineLogger: onlineLogger,
  appLogger: appLogger,
};
